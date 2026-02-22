"use server";
import { InputFile } from "node-appwrite/file";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { getFileType, parseStringify, constructFileUrl } from "../utils";
import {
  CurrentUser,
  FileDocument,
  FileType,
  GetFilesProps,
  UploadFileProps,
  RenameFileProps,
  UpdateFileUsersProps,
  DeleteFileProps,
  TotalSpaceUsed,
} from "@/types";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

export const handleError = async (
  error: unknown,
  message: string,
): Promise<never> => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps): Promise<unknown> => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketID,
      ID.unique(),
      inputFile,
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
      size: inputFile.size,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.filesCollectionID,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketID, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (
  currentUser: CurrentUser,
  types: string[] = [],
  searchText: string,
  sort: string,
  limit: number | undefined,
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit !== undefined) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = `$createdAt-desc`,
  limit,
}: GetFilesProps): Promise<unknown> => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return null;
    }

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      [...queries, Query.select(["*", "owner.fullName"])],
    );

    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps): Promise<unknown> => {
  const { databases } = await createAdminClient();

  try {
    const newname = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId,
      {
        name: newname,
      },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps): Promise<unknown> => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId,
      {
        users: emails,
      },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file users");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps): Promise<unknown> => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId,
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketID, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};

export const updateFile = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps): Promise<unknown> => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId,
      {
        users: emails,
      },
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export async function getTotalSpaceUsed(): Promise<TotalSpaceUsed | undefined> {
  try {
    const sessionClient = await createSessionClient();
    if (!sessionClient) throw new Error("User not authenticated");

    const { databases } = sessionClient;
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const files = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace: TotalSpaceUsed = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((rawFile: Models.Document) => {
      const file = rawFile as FileDocument;
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace) as TotalSpaceUsed;
  } catch (error) {
    handleError(error, "Failed to get total space used");
  }
}

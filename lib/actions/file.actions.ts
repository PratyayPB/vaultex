"use server";
import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { getFileType, parseStringify } from "../utils";
import { url } from "inspector";
import { error } from "console";
import { revalidatePath } from "next/cache";
export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketID,
      ID.unique(),
      inputFile
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
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.filesCollectionID,
        ID.unique(),
        fileDocument
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

const createQueries = (currentUser: Models.document) => {
  const queries = [
    Query.equal("owner", [currentUser.$id]),
    Query.contains("user", [currentUser.email]),
  ];

  return queries;
};
// export const getFiles = async ({
//   types = [],
//   searchText = "",
//   sort = `$createdAt-desc`,
//   limit,
// }) => {
//   const databases = await createAdminClient();
//   try {
//     const currentUser = await getCurrentUser();
//     if (!currentUser) {
//       throw new Error("User not found");
//     }

//     const queries = createQueries(currentUser,types,searchText,sort,limit);
//     const files = await databases.listDocuments(
//       appwriteConfig.databaseID,
//       appwriteConfig.filesCollectionID,
//       queries
//     );

//     return parseStringify(files);
//   } catch (error) {
//     handleError(error, "Failed to get files");
//   }
// };

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newname = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId,
      {
        name: newname,
      }
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
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId,
      {
        users: emails,
      }
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
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.filesCollectionID,
      fileId
    );

    if (deleteFile) {
      await storage.deleteFile(appwriteConfig.bucketID, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};

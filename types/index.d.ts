import { Models } from "node-appwrite";

declare type FileType = "document" | "image" | "video" | "audio" | "other";

/**
 * Shape of the user document returned by getCurrentUser / stored in the
 * Appwrite users collection.
 */
declare interface CurrentUser extends Models.Document {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

/** Shape returned by createAccount / signinUser / signInUser. */
declare interface AuthResult {
  accountId: string | null;
  error?: string;
}

/** Typed owner sub-document returned by Appwrite when using `Query.select` with relationship expansion. */
declare interface FileOwner {
  fullName: string;
}

/**
 * App-specific file document stored in the Appwrite files collection.
 * Extends `Models.Document` with every field written by `uploadFile`.
 */
declare interface FileDocument extends Models.Document {
  type: string;
  name: string;
  url: string;
  extension: string;
  size: number;
  owner: FileOwner;
  accountId: string;
  users: string[];
  bucketFileId: string;
}

declare type FileCategory = {
  size: number;
  latestDate: string;
};

declare type TotalSpaceUsed = {
  image: FileCategory;
  document: FileCategory;
  video: FileCategory;
  audio: FileCategory;
  other: FileCategory;
  used: number;
  all: number;
};

/** Legacy alias kept for backwards-compat with utils.ts `getUsageSummary`. */
declare type TotalSpace = {
  document: FileCategory;
  image: FileCategory;
  video: FileCategory;
  audio: FileCategory;
  other: FileCategory;
};

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

declare interface ShareInputProps {
  file: FileDocument;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024; //50MB

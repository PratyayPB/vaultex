import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export const getFileType = async (fileName: string) => {
  //AI Generated
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  let type = "unknown";

  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExts = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];
  const audioExts = ["mp3", "wav", "ogg", "flac", "aac", "m4a"];
  const docExts = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "md",
    "csv",
  ];
  const archiveExts = ["zip", "rar", "7z", "tar", "gz"];

  if (imageExts.includes(extension)) type = "image";
  else if (videoExts.includes(extension)) type = "video";
  else if (audioExts.includes(extension)) type = "audio";
  else if (docExts.includes(extension)) type = "document";
  else if (archiveExts.includes(extension)) type = "archive";

  return { type, extension };
};

export const getFileIcon = async () => {};

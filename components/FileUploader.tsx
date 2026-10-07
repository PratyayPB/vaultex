"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { convertFileToUrl } from "@/lib/utils";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { MAX_FILE_SIZE } from "@/constants";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const path = usePathname();

  const [files, setfiles] = useState<File[]>([]);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setfiles(acceptedFiles);
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setfiles((prevFiles) => {
            return prevFiles.filter((f) => f.name !== file.name);
          });

          return toast.error(
            `<span className="font-semibold">${file.name} </span> is too large. Max file size is 50MB.`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            },
          );
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setfiles((prevFiles) => {
                return prevFiles.filter((f) => f.name !== file.name);
              });
            }
          },
        );
      });
      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setfiles((prevFiles) => {
      return prevFiles.filter((f) => f.name != fileName);
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div {...getRootProps()} className="cursor-pointer relative">
        <input {...getInputProps()} />
        <Button type="button" className={cn("uploader-button", className)}>
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={20}
            height={20}
            className="size-4 xs:size-5 shrink-0"
          />
          <p className="text-xs xs:text-sm font-semibold">Upload</p>
        </Button>
        {files.length > 0 && (
          <ul className="uploader-preview-list">
            <h4 className="text-light-100 font-semibold text-xs xs:text-sm pb-1 border-b border-light-200/30">Uploading</h4>
            {files.map((file, index) => {
              const { type, extension } = getFileType(file.name);
              return (
                <li
                  key={`${file.name}-${index}`}
                  className="uploader-preview-item"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Thumbnail
                      type={type}
                      extension={extension}
                      url={convertFileToUrl(file)}
                      className="size-8 min-w-8 shrink-0"
                    />
                    <div className="preview-item-name min-w-0 flex-1">
                      <p className="truncate text-xs xs:text-sm">{file.name}</p>
                      <Image
                        src="/assets/icons/file-loader.gif"
                        width={60}
                        height={20}
                        alt="Loader"
                        className="h-4 w-auto"
                      />
                    </div>
                  </div>

                  <Image
                    src="/assets/icons/remove.svg"
                    width={20}
                    height={20}
                    alt="Remove"
                    className="size-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default FileUploader;

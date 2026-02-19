"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { convertFileToUrl } from "@/lib/utils";
import { MouseEvent } from "react";
// import { useToast } from "@/hooks/use-toast";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { MAX_FILE_SIZE } from "@/constants";
import { Toast } from "radix-ui";

// import { useSession } from "next-auth/react";

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
            prevFiles.filter((f) => f.name !== file.name);
          });
          // return toast({
          //   description: (
          //     <p className="body-2 text-white">
          //       <span className="font-semibold">{file.name}</span> is too large.
          //       Max file size is 50MB.
          //     </p>
          //   ),
          //   className: "error-toast",
          // });

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
                prevFiles.filter((f) => f.name !== file.name);
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
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setfiles((prevFiles) => {
      prevFiles.filter((f) => f.name != fileName);
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

      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <Button type="button" className={cn("uploader-button", className)}>
          <Image
            src="/assets/icons/upload.svg"
            alt="upload"
            width={24}
            height={24}
          />{" "}
          <p>Upload</p>
        </Button>
        {files.length > 0 && (
          <ul className="uploader-preview-list">
            <h4 className="text-light-100 h4">Uploading</h4>
            {files.map((file, index) => {
              const { type, extenstion } = getFileType(file.name);
              return (
                <li
                  key={`${file.name}-${index}`}
                  className="uploader-preview-item"
                >
                  <div className="flex items-center gap-3">
                    <Thumbnail
                      type={type}
                      extension={extenstion}
                      url={convertFileToUrl(file)}
                    />
                    <div className="preview-item-name">
                      {file.name}
                      <Image
                        src="/assets/icons/file-loader.gif"
                        width={80}
                        height={26}
                        alt="Loader"
                      />
                    </div>
                  </div>

                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt="Remove"
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

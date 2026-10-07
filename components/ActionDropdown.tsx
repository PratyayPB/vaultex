"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { constructDownloadUrl } from "@/lib/utils";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  renameFile,
  updateFileUsers,
  deleteFile,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";
import { ActionType, FileDocument } from "@/types";
import { actionsDropdownItems } from "@/constants";
import { toast } from "react-toastify";
import { storage } from "@/lib/appwrite/client";

const ActionDropdown = ({ file }: { file: FileDocument }) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [action, setaction] = useState<ActionType | null>(null);
  const [name, setname] = useState(file.name);
  const [isLoading, setisLoading] = useState(false);
  const [emails, setemails] = useState<string[]>([]);
  const path = usePathname();

  const closeAllModals = () => {
    setisModalOpen(false);
    setisDropdownOpen(false);
    setaction(null);
    setname(file.name);
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    const arrayBuffer = await storage.getFileDownload(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
      fileId,
    );
    const blob = new Blob([arrayBuffer]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAction = async () => {
    if (!action) return;
    setisLoading(true);
    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        })
          .then(() => {
            toast.success("File renamed successfully");
          })
          .finally(() => {
            closeAllModals();
          }),
      share: () => {
        updateFileUsers({ fileId: file.$id, emails, path });
      },
      delete: () => {
        deleteFile({
          fileId: file.$id,
          path,
          bucketFileId: file.bucketFileId,
        })
          .then(() => {
            toast.success("File deleted successfully");
          })
          .finally(() => {
            closeAllModals();
          });
      },
    };
    await actions[action.value as keyof typeof actions]();
    setisLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);
    await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });
    setemails(updatedEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog w-[92vw] max-w-[420px] sm:max-w-md p-4 xs:p-6 rounded-2xl">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-dark-100 font-bold text-base xs:text-lg">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              className="shad-input"
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setemails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete {` `}{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col gap-2.5 sm:flex-row mt-4">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  width={20}
                  height={20}
                  className="animate-spin ml-1"
                  alt="loader"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setisDropdownOpen}>
        <DropdownMenuTrigger className="p-1 rounded-full hover:bg-light-300 transition-colors cursor-pointer outline-none">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={20}
            height={20}
            className="size-5 xs:size-6"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 rounded-xl shadow-xl border border-light-200/40 bg-white p-1 z-50">
          <DropdownMenuLabel className="max-w-44 truncate text-xs font-semibold text-light-100 px-2 py-1.5">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-light-200/40 my-1" />
          {actionsDropdownItems.map(
            (actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs xs:text-sm text-dark-100 hover:bg-light-300 cursor-pointer transition-colors"
                onClick={() => {
                  setaction(actionItem);
                  if (actionItem.value === "download") {
                    downloadFile(file.$id, file.name);
                    return;
                  }

                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItem.value,
                    )
                  ) {
                    setisModalOpen(true);
                  }
                }}
              >
                <Image
                  src={actionItem.icon}
                  width={18}
                  height={18}
                  alt={actionItem.label}
                  className="size-4 opacity-70"
                />
                <span>{actionItem.label}</span>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;

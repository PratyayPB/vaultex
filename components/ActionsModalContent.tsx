import React from "react";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { FileDocument } from "@/types";

const ImageThumbnail = ({ file }: { file: FileDocument }) => {
  return (
    <div className="file-details-thumbnail flex items-center gap-3 p-3 rounded-xl bg-light-300/60 border border-light-200/30 mb-4">
      <Thumbnail
        type={file.type}
        extension={file.extension}
        url={file.url}
        className="size-9 xs:size-10 min-w-9 xs:min-w-10 shrink-0"
      />
      <div className="flex flex-col min-w-0 flex-1">
        <p className="subtitle-2 truncate text-dark-100 font-semibold text-xs xs:text-sm">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="caption text-[11px] text-light-200"
        />
      </div>
    </div>
  );
};

const DetailRow = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs xs:text-sm py-1.5 border-b border-light-200/20 last:border-none">
      <p className="file-details-label text-light-200 font-medium">{label}</p>
      <p className="file-details-value text-dark-100 font-semibold truncate text-right">{value}</p>
    </div>
  );
};

export const FileDetails = ({ file }: { file: FileDocument }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-1 px-1">
        <DetailRow value={file.extension} label="Format" />
        <DetailRow value={convertFileSize(file.size)} label="Size" />
        <DetailRow value={file.owner?.fullName || "User"} label="Owner" />
        <DetailRow value={formatDateTime(file.$updatedAt)} label="Last Edit:" />
      </div>
    </>
  );
};

interface ShareInputProps {
  file: FileDocument;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

export const ShareInput = ({ file, onInputChange, onRemove }: ShareInputProps) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper flex flex-col gap-3">
        <p className="subtitle-2 text-light-100 text-xs xs:text-sm font-medium">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="Enter email addresses (separated by comma)"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field shad-input"
        />
        <div className="pt-2">
          <div className="flex justify-between items-center text-xs xs:text-sm pb-1 border-b border-light-200/30">
            <p className="subtitle-2 text-light-100 font-semibold">Shared with</p>
            <p className="caption text-light-200">
              {file.users?.length || 0} user{(file.users?.length || 0) === 1 ? "" : "s"}
            </p>
          </div>
          <ul className="pt-2 flex flex-col gap-1 max-h-36 overflow-y-auto remove-scrollbar">
            {file.users && file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-light-300 transition-colors"
              >
                <p className="subtitle-2 text-xs xs:text-sm text-dark-100 truncate min-w-0 flex-1">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user size-7 p-0 rounded-full hover:bg-red/10 text-red flex items-center justify-center shrink-0 cursor-pointer shadow-none bg-transparent"
                  title="Remove user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    width={16}
                    height={16}
                    alt="remove"
                    className="size-4"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

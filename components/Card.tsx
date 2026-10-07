import { FileDocument } from "@/types";
import React from "react";
import Link from "next/link";
import { convertFileSize } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";

const Card = ({ file }: { file: FileDocument }) => {
  return (
    <div className="w-full bg-white rounded-2xl p-3.5 xs:p-4 sm:p-5 border border-light-200/40 shadow-sm hover:shadow-drop-3 transition-all duration-200 flex flex-col justify-between gap-3 sm:gap-4 group hover:border-brand/40">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={file.url}
          target="_blank"
          className="size-12 xs:size-14 sm:size-16 rounded-full bg-light-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
        >
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="size-8 xs:size-9 sm:size-10"
          />
        </Link>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <ActionDropdown file={file} />
          <span className="caption font-semibold text-light-100 text-[11px] xs:text-xs">
            {convertFileSize(file.size)}
          </span>
        </div>
      </div>

      <Link href={file.url} target="_blank" className="flex flex-col min-w-0">
        <p className="font-semibold text-dark-100 text-xs xs:text-sm sm:text-base truncate group-hover:text-brand transition-colors">
          {file.name}
        </p>
        <FormattedDateTime
          date={file.$createdAt}
          className="caption text-[10px] xs:text-[11px] sm:text-xs text-light-200 truncate mt-0.5"
        />
        <p className="caption text-[10px] xs:text-[11px] text-light-100 truncate mt-1">
          By: <span className="font-medium text-dark-100">{file.owner?.fullName || "User"}</span>
        </p>
      </Link>
    </div>
  );
};

export default Card;

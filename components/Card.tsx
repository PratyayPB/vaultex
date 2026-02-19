import { Models } from "node-appwrite";
import React from "react";
import Link from "next/link";
import { convertFileSize } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";
const Card = ({ file }: { file: Models.Document }) => {
  return (
    <div className="bg-white p-2 m-4 w-min rounded-2xl ">
      <Link href={file.url} target="_blank" className="file-card ">
        <div className="flex justify-between px-2 w-55 h-35">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-35 bg-gray-100 flex items-center justify-center rounded-full"
            imageClassName="!size-25"
          />
          <div className="flex flex-col items-end justify-start gap-6 pt-4">
            <ActionDropdown file={file} />
            <p className="body-2 line-clamp-1 ">{convertFileSize(file.size)}</p>
          </div>
        </div>

        <div className="file-card-details pl-4">
          <p className="subtitle-2 line-clamp-1">
            {file.name.length > 15 ? file.name.slice(0, 15) + "..." : file.name}
          </p>
          <FormattedDateTime
            date={file.$createdAt}
            className="body-2 text-light-100"
          />
          <p className="caption line-clamp-1 text-light-100">
            By:{file.owner.fullName}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Card;

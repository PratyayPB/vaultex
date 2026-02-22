import { FileDocument } from "@/types";
import React from "react";
import Link from "next/link";
import { convertFileSize } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropdown from "./ActionDropdown";

const Card = ({ file }: { file: FileDocument }) => {
  return (
    <div className="bg-white p-2 m-4 w-min rounded-2xl ">
      <Link href={file.url} target="_blank" className="file-card ">
        <div className="flex justify-between px-0 md:px-2 w-25 h-20 md:w-55 md:h-35">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-35 bg-gray-100  items-center justify-center rounded-full hidden md:flex"
            imageClassName="!size-25"
          />
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-18 bg-gray-100 flex items-center justify-center rounded-full md:hidden"
            imageClassName="!size-18"
          />
          <div className="flex flex-col items-end justify-start gap-6 pt-4">
            <ActionDropdown file={file} />
            <p className="body-2 line-clamp-1 hidden md:block">
              {convertFileSize(file.size)}
            </p>
          </div>
        </div>

        <div className="file-card-details md:pl-4 ">
          <p className="subtitle-2 line-clamp-1 hidden md:block">
            {file.name.length > 15 ? file.name.slice(0, 15) + "..." : file.name}
          </p>

          <p className="text-sm font-medium line-clamp-1 md:hidden">
            {file.name.length > 15 ? file.name.slice(0, 10) + "..." : file.name}
          </p>
          <FormattedDateTime
            date={file.$createdAt}
            className="body-2 text-light-100 hidden md:block"
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

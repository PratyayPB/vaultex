import { cn, getFileIcon } from "@/lib/utils";
import React from "react";
import Image from "next/image";
interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  imageClassName?: string;
  className?: string;
}

const Thumbnail = ({
  type,
  extension,
  url,
  imageClassName,
  className,
}: ThumbnailProps) => {
  const isImage = type === "image" && extension !== "svg";

  //figure:HTML element typically used for thumbnails, images, diagrams, etc. It can contain an img element and a figcaption element for captions.
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image",
          className,
        )}
      />
    </figure>
  );
};

export default Thumbnail;

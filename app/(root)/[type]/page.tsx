import { FileType, SearchParamProps } from "@/types";
import React from "react";
import Image from "next/image";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";
import { FileDocument } from "@/types";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const types = getFileTypesParams(type) as FileType[];

  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";
  const filesResult = await getFiles({ types, searchText, sort });
  const files = filesResult as {
    documents: FileDocument[];
    total: number;
  } | null;

  return (
    <div className="page-container p-3 xs:p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto w-full space-y-6">
      <section className="w-full flex flex-col gap-4 pb-4 border-b border-light-200/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="h1 capitalize text-dark-100">{type}</h1>
            <p className="body-2 text-light-200 mt-1">
              Total: <span className="font-bold text-dark-100">{files?.total ?? 0}</span> files
            </p>
          </div>

          <div className="sort-container flex items-center gap-2 self-start sm:self-auto">
            <span className="subtitle-2 text-light-100 hidden xs:inline-block">
              Sort by:
            </span>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render Files */}
      {files && files.total > 0 ? (
        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 xs:gap-4 sm:gap-5">
          {files.documents.map((file: FileDocument) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Image
            src="/assets/icons/file-document-light.svg"
            alt="Empty"
            width={56}
            height={56}
            className="size-14 opacity-30 mb-3"
          />
          <p className="empty-list text-light-200 text-sm xs:text-base font-medium">No files uploaded in this category</p>
        </div>
      )}
    </div>
  );
};

export default Page;

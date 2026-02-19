import { FileType, SearchParamProps } from "@/types";
import React from "react";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";
import { file } from "zod";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const types = getFileTypesParams(type) as FileType[];

  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";
  const files = await getFiles({ types, searchText, sort });

  return (
    <div className="page-container p-8 h-[90vh] overflow-y-scroll">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section flex justify-between  items-center px-1">
          <p className="body-1 text-left">
            Total: <span className="h-5">{files.total}</span>
          </p>
          <div className="sort-container">
            <p className="subtitle-1 hidden sm:block text-light-100">
              Sort by
              <Sort />
            </p>
          </div>
        </div>
      </section>

      {/* Render Files */}

      {files.total > 0 ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
          {files.documents.map((file: Models.Document) => (
            <h1 className="h1" key={file.$id}>
              <Card key={file.$id} file={file} />
            </h1>
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;

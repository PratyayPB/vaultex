import { FileType, SearchParamProps } from "@/types";
import React from "react";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";
import { Models } from "node-appwrite";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const types = getFileTypesParams(type) as FileType[];

  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";
  const files = await getFiles({ types, searchText, sort });

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h-5"></span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">
              Sort by
              <Sort />
            </p>
          </div>
        </div>
      </section>

      {/* Render Files */}

      {/* {files.total > 0 ? ( */}
      {0 > 0 ? (
        <section className="file-list">
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

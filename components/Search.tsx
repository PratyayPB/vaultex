"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { FileDocument } from "@/types";
import Thumbnail from "./Thumbnail";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import FormattedDateTime from "./FormattedDateTime";

const Search = () => {
  const [query, setquery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setresults] = useState<FileDocument[]>([]);
  const [open, setopen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setresults([]);
        setopen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ types: [], searchText: debouncedQuery }) as {
        documents: FileDocument[];
      } | null;
      setresults(files?.documents ?? []);
      setopen(true);
    };
    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setquery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: FileDocument) => {
    setopen(false);
    setresults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };
  return (
    <div className="search w-full">
      <div className="search-input-wrapper relative w-full flex items-center">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-3.5 size-4 xs:size-5 pointer-events-none opacity-60"
        />
        <Input
          value={query}
          placeholder="Search files..."
          className="search-input w-full h-10 xs:h-11 pl-10 pr-4 rounded-full bg-light-300/70 border border-light-200/40 text-xs xs:text-sm text-dark-100 placeholder:text-light-200 focus-visible:ring-1 focus-visible:ring-brand focus-visible:bg-white transition-all shadow-none"
          onChange={(e) => {
            setquery(e.target.value);
          }}
        />

        {open && (
          <div className="absolute left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 top-full mt-2 w-[calc(100vw-2rem)] xs:w-80 sm:w-96 lg:w-full max-w-lg bg-white border border-light-200/50 p-3 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto remove-scrollbar">
            <ul className="search-result flex flex-col gap-1">
              {results.length > 0 ? (
                results.map((file) => (
                  <li
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-light-300 transition-colors cursor-pointer gap-2"
                    key={file.$id}
                    onClick={() => handleClickItem(file)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Thumbnail
                        type={file.type}
                        extension={file.extension}
                        url={file.url}
                        className="size-8 xs:size-9 min-w-8 xs:min-w-9 shrink-0"
                      />
                      <p className="subtitle-2 text-xs xs:text-sm text-dark-100 truncate">
                        {file.name}
                      </p>
                    </div>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption text-[11px] xs:text-xs text-light-200 shrink-0"
                    />
                  </li>
                ))
              ) : (
                <p className="empty-result py-4 text-center text-xs xs:text-sm text-light-200">
                  No files found
                </p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

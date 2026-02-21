"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import FormattedDateTime from "./FormattedDateTime";

const Search = () => {
  const [query, setquery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setresults] = useState<Models.Document[]>([]);
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
      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setresults(files.documents);
      setopen(true);
    };
    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setquery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setopen(false);
    setresults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };
  return (
    <div className="search ">
      <div className="search-input-wrapper relative ">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="absolute mt-1 ml-2"
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input pl-10 outline-none border-none"
          onChange={(e) => {
            setquery(e.target.value);
          }}
        />

        {open && (
          <div className="absolute left-0 top-full mt-2 max-w-300 bg-red-100 px-4 py-2 rounded-2xl shadow-lg z-50">
            <ul className="search-result flex flex-col gap-3">
              {results.length > 0 ? (
                results.map((file) => (
                  <li
                    className="flex items-center justify-between"
                    key={file.$id}
                    onClick={() => handleClickItem(file)}
                  >
                    <div className="flex cursor-pointer items-center gap-4">
                      <Thumbnail
                        type={file.type}
                        extension={file.extension}
                        url={file.url}
                        className="size-9 min-w-9"
                      />
                      <p className="subtitle-2 line-clamp-1 text-light-100">
                        {file.name}
                      </p>
                    </div>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption line-clamp-1 text-light-200"
                    />
                  </li>
                ))
              ) : (
                <p className="empty-result">No files found</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

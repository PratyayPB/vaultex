"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/constants";
const Sort = () => {
  const path = usePathname();
  const router = useRouter();
  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select h-9 xs:h-10 w-[150px] xs:w-[180px] sm:w-[210px] rounded-full border border-light-200/50 bg-white px-3 text-xs xs:text-sm text-dark-100 shadow-none focus:ring-1 focus:ring-brand cursor-pointer">
        <SelectValue placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content w-[180px] sm:w-[210px] rounded-xl border border-light-200/40 bg-white shadow-xl z-50">
        {sortTypes.map((sort) => {
          return (
            <SelectItem
              key={sort.label}
              value={sort.value}
              className="sort-select-item text-xs xs:text-sm cursor-pointer hover:bg-light-300"
            >
              {sort.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default Sort;

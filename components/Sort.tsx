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
      <SelectTrigger className="sort-select w-full max-w-60 mt-2 border-2 ">
        <SelectValue placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content w-50">
        {sortTypes.map((sort) => {
          return (
            <SelectItem
              key={sort.label}
              value={sort.value}
              className="sort-select-item line-clamp-1"
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

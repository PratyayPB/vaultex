import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="header hidden lg:flex items-center justify-between gap-6 xl:gap-10 py-4 xl:py-5 px-6 xl:px-8 bg-white border-b border-light-200/20 w-full shrink-0">
      <div className="flex-1 max-w-md xl:max-w-lg 2xl:max-w-xl">
        <Search />
      </div>
      <div className="header-wrapper flex items-center gap-4 xl:gap-6 shrink-0">
        <FileUploader
          ownerId={userId}
          accountId={accountId}
        />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button
            type="submit"
            className="size-11 xl:size-12 rounded-full bg-brand/10 hover:bg-brand/20 text-brand p-0 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-none border border-brand/20"
            title="Sign Out"
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={22}
              height={22}
              className="size-5 filter-brand"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;

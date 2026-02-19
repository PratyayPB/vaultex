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
    <header className="header lg:flex justify-between py-5 px-10 hidden ">
      <Search />
      <div className="header-wrapper flex justify-between  gap-8">
        <FileUploader
          ownerId={userId}
          accountId={accountId}
          className="transition-all duration-300 hover:scale-125 cursor-pointer"
        />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button
            type="submit"
            className="border-2 border-red-100 bg-red-100 hover:bg-red-100 transition-all duration-300 hover:scale-125"
          >
            <Image
              src="/assets/icons/logout.svg"
              alt="upload"
              width={24}
              height={24}
              className="w-6 filter transition-all opacity-100 duration-300 hover:scale-125 cursor-pointer "
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;

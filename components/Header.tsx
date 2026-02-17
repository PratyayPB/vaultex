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
    <header className="header flex justify-between">
      <Search />
      <div className="header-wrapper flex justify-between">
        {/* <FileUploader ownerId={userId} accountId={accountId} /> */}
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit">
            <Image
              src="/assets/icons/logout.svg"
              alt="upload"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
          t
        </form>
      </div>
    </header>
  );
};

export default Header;

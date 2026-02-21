"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";
import Search from "./Search";

interface MobileNavProps {
  $id: string;
  accountId: string;
  avatar: string;
  fullName: string;
  email: string;
}

const MobileNav = ({
  $id: ownerId,
  accountId,
  avatar,
  fullName,
  email,
}: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header lg:hidden flex justify-between items-center py-5 px-6">
      <Image
        src="/assets/icons/logo-brand.svg"
        alt="logo"
        width={52}
        height={52}
      />
      <Search />
      <FileUploader ownerId={ownerId} accountId={accountId} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
            className="h-auto"
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user flex items-center gap-15 py-2">
                <Image
                  src={avatar}
                  alt="avatar"
                  width={44}
                  height={44}
                  className="header-user-avatar"
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
              <Separator className="my-4 bg-light-200" />
            </SheetTitle>
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {navItems.map(({ url, name, icon }) => (
                  <Link key={name} href={url} className="lg:w-full">
                    <li
                      className={cn(
                        "mobile-nav-item flex items-center gap-4 py-3",
                        pathname === url && "shad-active",
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "nav-icon invert opacity-35 filter ",
                          pathname === url && "nav-icon-active",
                        )}
                      />
                      <p>{name}</p>
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>
            <Separator className="my-5 bg-light-200/20" />
            <div className="flex flex-col justify-between gap-5">
              {/* <FileUploader /> */}
              <Button
                type="submit"
                className="mobile-sign-out-button"
                onClick={async () => {
                  await signOutUser();
                }}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="upload"
                  width={24}
                  height={24}
                />
                <p>Logout</p>
              </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNav;

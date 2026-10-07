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
import { navItems, avatarPlaceholderUrl } from "@/constants";
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
    <header className="mobile-header lg:hidden flex items-center justify-between gap-2 xs:gap-3 sm:gap-4 py-3 xs:py-4 px-3 xs:px-4 sm:px-6 bg-white border-b border-light-200/20 sticky top-0 z-40 w-full">
      <Link href="/" className="shrink-0">
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={44}
          height={44}
          className="size-9 xs:size-10 sm:size-11 h-auto"
        />
      </Link>
      <div className="flex-1 min-w-0 max-w-sm sm:max-w-md mx-1 xs:mx-2">
        <Search />
      </div>
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="p-1 rounded-lg hover:bg-light-300 transition-colors cursor-pointer">
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              width={28}
              height={28}
              className="size-6 xs:size-7"
            />
          </SheetTrigger>
          <SheetContent className="shad-sheet h-screen w-[280px] xs:w-[320px] sm:w-[360px] p-4 xs:p-6 overflow-y-auto">
            <SheetHeader className="text-left">
              <SheetTitle>
                <div className="header-user flex items-center gap-3 py-2">
                  <Image
                    src={avatar || avatarPlaceholderUrl}
                    alt="avatar"
                    width={44}
                    height={44}
                    className="header-user-avatar size-10 xs:size-11 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="subtitle-2 capitalize truncate text-dark-100 font-semibold text-sm xs:text-base">
                      {fullName}
                    </p>
                    <p className="caption text-light-100 truncate text-xs">
                      {email}
                    </p>
                  </div>
                </div>
                <Separator className="my-4 bg-light-200/40" />
              </SheetTitle>
              <nav className="mobile-nav w-full">
                <ul className="mobile-nav-list flex flex-col gap-1 w-full">
                  {navItems.map(({ url, name, icon }) => {
                    const active = pathname === url;
                    return (
                      <Link
                        key={name}
                        href={url}
                        className="w-full"
                        onClick={() => setOpen(false)}
                      >
                        <li
                          className={cn(
                            "mobile-nav-item flex items-center gap-3.5 px-4 py-3 rounded-full transition-all duration-200 text-sm font-medium",
                            active
                              ? "bg-brand text-white shadow-drop-2 font-semibold"
                              : "text-light-100 hover:bg-light-300 hover:text-dark-100",
                          )}
                        >
                          <Image
                            src={icon}
                            alt={name}
                            width={22}
                            height={22}
                            className={cn(
                              "size-5 transition-all",
                              active
                                ? "brightness-0 invert opacity-100"
                                : "opacity-60",
                            )}
                          />
                          <p>{name}</p>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </nav>
              <Separator className="my-5 bg-light-200/30" />
              <div className="flex flex-col justify-between gap-4 mt-auto pt-4">
                <Button
                  type="submit"
                  className="mobile-sign-out-button cursor-pointer"
                  onClick={async () => {
                    await signOutUser();
                  }}
                >
                  <Image
                    src="/assets/icons/logout.svg"
                    alt="logout"
                    width={22}
                    height={22}
                    className="size-5"
                  />
                  <p>Logout</p>
                </Button>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileNav;

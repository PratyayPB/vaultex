"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navItems, avatarPlaceholderUrl } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
interface SidebarProps {
  fullName: string;
  email: string;
  avatar: string;
}

const Sidebar = ({ fullName, email, avatar }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar my-8 px-6 justify-between pb-30 lg:pb-2 hidden lg:flex flex-col  items-center ">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="h-auto lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item flex gap-3 items-center",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon filter invert opacity-35 ",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png" //File Icon
        alt="logo"
        width={506}
        height={418}
        className="w-full hidden lg:block"
      />
      <div className="sidebar-user-info flex gap-2 items-center bg-red-100 p-4 border rounded-2xl hidden lg:block">
        <Image
          src={avatar || avatarPlaceholderUrl}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>

      <div className="sidebar-user-info flex  items-center  lg:hidden">
        <Image
          src={avatar || avatarPlaceholderUrl}
          alt="avatar"
          width={24}
          height={24}
          className="sidebar-user-avatar"
        />
      </div>
    </aside>
  );
};

export default Sidebar;

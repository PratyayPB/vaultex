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
    <aside className="sidebar hidden lg:flex flex-col justify-between py-6 px-4 xl:px-6 w-[240px] xl:w-[280px] 2xl:w-[300px] shrink-0 h-screen bg-white border-r border-light-200/30 overflow-y-auto remove-scrollbar">
      <div className="flex flex-col gap-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={160}
            height={50}
            className="h-auto w-[140px] xl:w-[160px]"
            priority
          />
        </Link>

        <nav className="sidebar-nav w-full">
          <ul className="flex flex-1 flex-col gap-2">
            {navItems.map(({ url, name, icon }) => {
              const active = pathname === url;
              return (
                <Link key={name} href={url} className="w-full">
                  <li
                    className={cn(
                      "sidebar-nav-item flex items-center gap-3.5 px-4 py-3 rounded-full transition-all duration-200",
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
                        "size-5 transition-all duration-200",
                        active
                          ? "brightness-0 invert opacity-100"
                          : "opacity-60",
                      )}
                    />
                    <p className="text-sm font-medium">{name}</p>
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="flex flex-col gap-6 items-center w-full mt-6">
        <Image
          src="/assets/images/files-2.png"
          alt="Illustration"
          width={506}
          height={418}
          className="w-full max-w-[200px] xl:max-w-[240px] h-auto object-contain hidden xl:block"
        />

        <div className="sidebar-user-info flex gap-3 items-center bg-brand/10 p-3 xl:p-4 rounded-2xl border border-brand/20 w-full">
          <Image
            src={avatar || avatarPlaceholderUrl}
            alt="avatar"
            width={44}
            height={44}
            className="sidebar-user-avatar size-10 xl:size-11 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="subtitle-2 capitalize truncate text-dark-100 text-xs xl:text-sm font-semibold">
              {fullName}
            </p>
            <p className="caption text-light-100 truncate text-[11px] xl:text-xs">
              {email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

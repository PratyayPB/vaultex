import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { CurrentUser } from "@/types";

//import Toaster
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/signin");
  }

  // After the redirect guard, currentUser is guaranteed to be CurrentUser
  const user = currentUser as CurrentUser;

  return (
    <main className="flex h-screen">
      <Sidebar
        fullName={user.fullName}
        email={user.email}
        avatar={user.avatar}
      />
      <section className="flex  flex-1 flex-col">
        <MobileNav
          $id={user.$id}
          accountId={user.accountId}
          avatar={user.avatar}
          fullName={user.fullName}
          email={user.email}
        />
        <Header userId={user.$id} accountId={user.accountId} />
        <div className="main-content bg-gray-100 rounded-t-2xl lg:mx-4  mx-2 ">
          {children}
        </div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;

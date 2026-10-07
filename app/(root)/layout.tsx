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
    <main className="flex h-screen w-full overflow-hidden bg-white 2xl:max-w-[2000px] 2xl:mx-auto">
      <Sidebar
        fullName={user.fullName}
        email={user.email}
        avatar={user.avatar}
      />
      <section className="flex flex-1 flex-col h-screen overflow-hidden min-w-0">
        <MobileNav
          $id={user.$id}
          accountId={user.accountId}
          avatar={user.avatar}
          fullName={user.fullName}
          email={user.email}
        />
        <Header userId={user.$id} accountId={user.accountId} />
        <div className="main-content flex-1 overflow-y-auto bg-light-400 rounded-t-2xl lg:rounded-2xl mb-0 lg:mb-3 lg:mr-4 mx-2 xs:mx-3 sm:mx-4 lg:mx-0">
          {children}
        </div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;

import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

//import Toaster
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/signin");
  }
  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex  flex-1 flex-col">
        <MobileNav {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content bg-gray-100 rounded-t-2xl lg:mx-4  mx-2 ">
          {children}
        </div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;

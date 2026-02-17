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
    <main className="flex h-screen bg-brand-100">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNav {...currentUser} />{" "}
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content bg-white">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;

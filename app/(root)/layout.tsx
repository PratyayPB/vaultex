import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toast } from "radix-ui";
//import Toaster
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/sign-in");
  }
  return (
    <main className="flex h-screen bg-brand-100">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNav {...currentUser} />{" "}
        <Header userId={currentUser.$id} acountId={currentUser.accountId} />
        <div className="main-content bg-white">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;

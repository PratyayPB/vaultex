import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-light-300 lg:bg-white">
      {/* Desktop / Large Screen Branding Sidebar */}
      <section className="hidden w-1/2 items-center justify-center bg-brand p-8 xl:p-12 lg:flex xl:w-2/5 2xl:w-1/3">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-8 xl:space-y-12">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[180px] xl:w-[224px]"
            priority
          />

          <div className="space-y-4 xl:space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1 text-white/80">
              This is a place where you can securely store, manage, and share all your documents.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={342}
            height={342}
            className="transition-all duration-300 hover:rotate-2 hover:scale-105 mx-auto max-w-[280px] xl:max-w-[342px] h-auto"
          />
        </div>
      </section>

      {/* Main Form Section */}
      <section className="flex flex-1 flex-col items-center justify-center bg-white p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 min-h-screen">
        <div className="w-full max-w-[440px] xs:max-w-[480px] sm:max-w-[520px] lg:max-w-none flex flex-col items-center">
          <div className="mb-8 xs:mb-10 lg:hidden">
            <Image
              src="/assets/icons/logo-full-brand.svg"
              alt="logo"
              width={200}
              height={70}
              className="h-auto w-[160px] xs:w-[180px] sm:w-[200px]"
              priority
            />
          </div>

          {children}
        </div>
      </section>
    </div>
  );
};

export default Layout;

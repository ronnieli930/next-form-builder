import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border h-[60px] px-4 py-2">
        <Logo />
        <div className="flex gap-4 item-center">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </nav>
      <div className="flex w-full flex-grow">{children}</div>
    </div>
  );
}

export default Layout;

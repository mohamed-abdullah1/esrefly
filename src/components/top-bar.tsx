"use client";
import React from "react";
import { ModeToggle } from "./toggle-theme";
import LanguageSwitcher from "./language-switcher";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

const TopBar = () => {
  const { isMobile } = useSidebar();
  return (
    <header
      className={cn(
        "flex justify-between items-center p-4  ",
        "sticky top-0 z-50 backdrop-blur bg-transparent overflow-clip",
        !isMobile ? `w-[calc(100vw-18rem)] max-w-[1990px] mx-auto ` : "w-[97vw]"
      )}
    >
      {isMobile && <SidebarTrigger />}
      {/* COMPONENTS */}
      <div className="flex gap-2 justify-end items-center min-w-full">
        <ModeToggle />
        <div className="w-fit">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default TopBar;

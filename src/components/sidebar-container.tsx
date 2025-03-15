"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, MessageCircle } from "lucide-react";
import { ROUTES } from "@/lib/enums";
import {
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "home",
    url: ROUTES.MAIN,
    icon: Home,
  },
  {
    title: "chat",
    url: ROUTES.CHAT,
    icon: MessageCircle,
  },
];

const SidebarContainer = () => {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <>
      <SidebarHeader className="py-4">
        {/* LOGO */}
        <div className="flex gap-2 items-center mx-auto" dir="ltr">
          <Image
            alt="logo"
            src={"/logos/small-esrefly.svg"}
            width="60"
            height="60"
          />
          <h1 className={cn("text-4xl font-bold", "font-[poppins]")}>SREFLY</h1>
        </div>
      </SidebarHeader>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "w-[90%] mx-2",
                  pathname === item.url ? "bg-primary text-white" : ""
                )}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{t(item.title)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>{" "}
      <SidebarFooter />
    </>
  );
};

export default SidebarContainer;

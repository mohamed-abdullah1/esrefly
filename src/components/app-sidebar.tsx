"use client";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/enums";
import isSiteArabic from "@/lib/is-site-arabic";
import { cn } from "@/lib/utils";
import { Home, MessageCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: ROUTES.MAIN,
    icon: Home,
  },
  {
    title: "Chat",
    url: ROUTES.CHAT,
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  console.log("🔥✨ ", { theme });

  return (
    <Sidebar side={isSiteArabic() ? "right" : "left"}>
      <SidebarHeader className="py-4">
        {/* LOGO */}
        <div className="flex gap-2 items-center mx-auto">
          <Image
            alt="logo"
            src={"/logos/small-esrefly.svg"}
            width="60"
            height="60"
          />
          <h1 className="text-4xl font-bold">SREFLY</h1>
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
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>{" "}
      <SidebarFooter />
    </Sidebar>
  );
}

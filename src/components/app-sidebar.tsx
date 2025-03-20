"use client";
import { fetchPromptHistory } from "@/actions/incomes";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { COOKIES_KEYS, ROUTES } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Home, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDateContext } from "./date-provider";
import { Spinner } from "./loading-spinner";

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

export function AppSidebar() {
  const {
    data: prompts,
    isPending: promptsIsPending,
    refetch,
  } = useQuery({
    queryKey: ["prompts"],
    queryFn: fetchPromptHistory,
    refetchOnWindowFocus: false,
  });
  const { chosenDate, setChosenDate } = useDateContext();

  const pathname = usePathname();
  const t = useTranslations();
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar
      side={
        document.cookie
          .split("; ")
          .find((row) => row.startsWith(COOKIES_KEYS.LOCALIZATION + "="))
          ?.split("=")[1] === "ar"
          ? "right"
          : "left"
      }
    >
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
                onClick={() => setOpenMobile(false)}
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
      </SidebarGroupContent>
      {pathname === ROUTES.CHAT && (
        <SidebarGroupContent className="py-4">
          <SidebarHeader className="py-4 font-bold">
            <span>{t("history")}</span>
          </SidebarHeader>
          <SidebarMenu>
            {promptsIsPending ? (
              <div className="grid place-content-center">
                <Spinner className="!w-5 !h-5 border-[3px]" />
              </div>
            ) : (
              prompts?.map((prompt) => (
                <SidebarMenuItem key={prompt.createdDate}>
                  <SidebarMenuButton
                    onClick={() => {
                      setOpenMobile(false);
                      setChosenDate(prompt.createdDate);
                      refetch();
                    }}
                    asChild
                    className={cn(
                      "w-[90%] mx-2",
                      "cursor-pointer",
                      "hover:!bg-primary/10 hover:text-primary",
                      chosenDate === prompt.createdDate &&
                        "!bg-primary/10 text-primary"
                    )}
                  >
                    <div className="text-primary/90 border-1 font-semibold ">
                      <span>{prompt.createdDate}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
      <SidebarFooter />
    </Sidebar>
  );
}

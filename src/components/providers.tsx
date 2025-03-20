"use client";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import ReactQueryProviders from "./react-query-provider";
import { ThemeProvider } from "./theme-provider";
import TopBar from "./top-bar";
import { SidebarProvider } from "./ui/sidebar";
import { Toaster } from "./ui/sonner";
import { DateProvider } from "./date-provider";
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ReactQueryProviders>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <DateProvider>
          <SidebarProvider>
            {!pathname.includes("auth") && <AppSidebar />}
            <main>
              {!pathname.includes("auth") && <TopBar />}
              {children}
            </main>
          </SidebarProvider>
        </DateProvider>
      </ThemeProvider>
      <Toaster
        richColors={true}
        expand={false}
        style={{ fontFamily: "inherit" }}
      />
    </ReactQueryProviders>
  );
}

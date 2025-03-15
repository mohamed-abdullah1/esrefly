import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import Providers from "@/components/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import TopBar from "@/components/top-bar";

const poppins = localFont({
  src: [
    {
      path: "../fonts/poppins/Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    // Add more variants as needed
  ],
  variable: "--font-poppins",
  display: "swap",
});
const cairo = localFont({
  src: [
    {
      path: "../fonts/cairo/Cairo-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/cairo/Cairo-SemiBold.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/cairo/Cairo-Bold.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/cairo/Cairo-Bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/cairo/Cairo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    // Add more variants as needed
  ],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Esrefly",
  description: "Your financial assistant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${locale === "en" ? poppins.className : cairo.className}
        antialiased 
    `}
        dir={locale === "en" ? "ltr" : "rtl"}
      >
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <main>
              <TopBar />

              {children}
            </main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}

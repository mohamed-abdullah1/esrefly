import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import Providers from "@/components/providers";
import LocalizationProvider from "@/components/localization";
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
  description: "مساعدك المالي الجديد باستعمال الذكاء الاصطناعي",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph: {
    images: "/logo-esr.png",
  },
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
        <LocalizationProvider>
          <Providers>{children}</Providers>
        </LocalizationProvider>
      </body>
    </html>
  );
}

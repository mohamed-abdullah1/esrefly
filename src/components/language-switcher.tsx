"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { COOKIES_KEYS } from "@/lib/enums";

const LanguageSwitcher = ({ iconColor }: { iconColor?: string }) => {
  const [locale, setLocale] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith(COOKIES_KEYS.LOCALIZATION + "="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `${COOKIES_KEYS.LOCALIZATION}=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `${COOKIES_KEYS.LOCALIZATION}=${newLocale};  path=/; SameSite=Strict`;
    router.refresh();
  };

  return (
    <div
      className={`icon-btn-style`}
      onClick={() => changeLocale(locale === "ar" ? "en" : "ar")}
    >
      <Languages style={{ color: iconColor }} />
    </div>
  );
};

export default LanguageSwitcher;

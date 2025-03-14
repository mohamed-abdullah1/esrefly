import { COOKIES_KEYS, LANG } from "@/lib/enums";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(COOKIES_KEYS.LOCALIZATION)?.value;
  const locale = cookieLocale ? cookieLocale : LANG.EN;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

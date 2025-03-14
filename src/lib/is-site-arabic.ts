import Cookies from "js-cookie";
import { COOKIES_KEYS, LANG } from "./enums";

export default function isSiteArabic() {
  const locale = Cookies.get(COOKIES_KEYS.LOCALIZATION) || LANG.EN;
  return locale === LANG.AR;
}

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return <main className="container mx-auto !py-0">{t("test")}</main>;
}

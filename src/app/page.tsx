import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return <main className="container mx-auto">{t("test")}</main>;
}

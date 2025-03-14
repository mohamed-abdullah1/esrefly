import LanguageSwitcher from "@/components/language-switcher";
import { ModeToggle } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <main className="container mx-auto">
      <ModeToggle />
      <div className="w-fit">
        <LanguageSwitcher />
      </div>
      <Button>{t("test")}</Button>
    </main>
  );
}

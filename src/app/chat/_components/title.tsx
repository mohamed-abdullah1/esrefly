"use client";
import { useTranslations } from "next-intl";

const Title = () => {
  const t = useTranslations();
  return (
    <>
      <h1 className="text-4xl font-bold py-2">{t("chat")}</h1>
      <p className="text-neutral-500 pb-6">{t("chat-desc")}</p>
    </>
  );
};

export default Title;

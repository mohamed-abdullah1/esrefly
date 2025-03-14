import { getLocale, getMessages } from "next-intl/server";
import React from "react";
import { NextIntlClientProvider } from "next-intl";

const LocalizationProvider = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <NextIntlClientProvider messages={messages || {}} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
};

export default LocalizationProvider;

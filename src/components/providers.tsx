import LocalizationProvider from "./localization";
import { ThemeProvider } from "./theme-provider";
export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocalizationProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}

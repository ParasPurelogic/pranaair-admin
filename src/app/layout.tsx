import "@/app/globals.css";
import Script from "next/script";
import { Nunito_Sans } from "next/font/google";

const primaryFont = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "Times New Roman"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${primaryFont.className} ${theme.misc.rootFontSizes}`}
      style={{
        // @ts-expect-error type
        "--color-primary": theme.primaryColor,
      }}
    >
      <body className={`${theme.misc.bodyClasses}`}>
        <main>{children}</main>
        <Toaster richColors position="top-right" />
        <NextTopLoader
          zIndex={9999999999}
          color="var(--color-primary)"
          height={3}
          showSpinner={false}
        />
      </body>
    </html>
  );
}

import "./globals.css";
import { siteName } from "@/config";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import theme from "@/theme";

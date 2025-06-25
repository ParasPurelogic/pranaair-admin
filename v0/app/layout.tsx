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
    <html lang="en" className={`${primaryFont.className}`}>
      <body>
        <main>{children}</main>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

import "./globals.css";
import { siteName } from "@/config";

import "@/app/globals.css";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { siteName } from "@/config";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import theme from "@/theme";

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
      className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[17px] [--body-padding:1rem] sm:[--body-padding:1.5rem] lg:[--body-padding:2rem]"
      style={{
        // @ts-expect-error type
        "--color-primary": theme.primaryColor,
      }}
    >
      <body className="text-[1rem]">
        <main className="w-full min-h-full">{children}</main>
        <Toaster richColors position="top-right" />
        <NextTopLoader
          zIndex={9999999999}
          color="var(--color-primary)"
          height={6}
          showSpinner={false}
        />
      </body>
    </html>
  );
}

import { CartProvider } from "@/context/CartProvider"
import { AuthProvider } from "@/context/AuthProvider"
import MainHeader from "@/components/MainHeader"
import MainFooter from "@/components/MainFooter"
import "./globals.css"
import Script from "next/script"

export const metadata = {
  title: "Prana Air - Air Quality Monitoring Solutions",
  description: "Prana Air offers advanced air quality monitoring solutions for indoor and outdoor environments.",
    generator: 'v0.dev'
}

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="app-container">
              <MainHeader />
              <main>{children}</main>
              <MainFooter />
            </div>
          </CartProvider>
        </AuthProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}


import './globals.css'

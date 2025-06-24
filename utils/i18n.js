"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

const defaultLocale = "en"

const translations = {
  en: {
    "footer.copyright": "Copyright © Prana Air 2024",
    "footer.email": "Email",
    "footer.phone": "Phone",
    "footer.regions.india": "India",
    "footer.regions.us": "US",
    "footer.columns.quickLinks": "Quick Links",
    "footer.columns.ourProducts": "Our Products",
    "footer.columns.otherLinks": "Other Links",
    "footer.contactDetails": "Contact Details",
    "footer.yourOrder": "Track your order",
    "footer.tracking": "Tracking",
    "footer.findUsOn": "Find us on",
    "footer.home": "Home",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.blog": "Blog",
    "footer.faqs": "FAQs",
    "footer.shop": "Shop",
    "footer.airQualityMonitors": "Air Quality Monitors",
    "footer.airQualitySensors": "Air Quality Sensors",
    "footer.airQualityDrone": "Air Quality Drone",
    "footer.airQualityPCBs": "Air Quality PCBs",
    "footer.weatherStation": "Weather Station",
    "footer.freshAirMachine": "Fresh Air Machine",
    "footer.airQualitySolutions": "Air Quality Solutions",
    "footer.productManuals": "Product Manuals",
    "footer.dataAccuracy": "Data Accuracy",
    "footer.caseStudy": "Case Study",
    "footer.refundPolicy": "Refund Policy",
    "footer.privacyPolicy": "Privacy Policy",
  },
}

export function useTranslations() {
  const router = useRouter()
  const locale = router.locale || defaultLocale

  const t = useCallback(
    (key) => {
      const value = translations[locale]?.[key] || key
      return value
    },
    [locale],
  )

  const getLocalizedPath = (path, targetLocale) => {
    const currentLocale = locale || defaultLocale
    const newLocale = targetLocale || currentLocale

    if (newLocale === defaultLocale) {
      return path.replace(`/${currentLocale}`, "")
    }

    return `/${newLocale}${path}`
  }

  return {
    t,
    locale,
    setLocale: router.push,
    availableLocales: [{ code: "en", name: "English" }],
    getLocalizedPath,
  }
}

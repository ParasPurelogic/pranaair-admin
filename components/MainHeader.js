"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ShoppingCart, ChevronRight, X } from "lucide-react"
// Use the real cart context
import { useCart } from "@/context/CartProvider"
import { MegaMenu } from "@/components/MegaMenu"
// Updated navigation data with all product categories
const mainNavigation = [
  {
    megaMenu: [
      {
        name: "Air Quality Monitors",
        slug: "air-quality-monitor",
        icon: "/icons/monitor.svg",
        subcategories: [
          {
            name: "Handheld",
            slug: "handheld",
            icon: "/icons/handheld.svg",
            products: [
              {
                name: "Pocket Monitor",
                slug: "pocket-monitor",
                image: "https://www.pranaair.com/wp-content/uploads/2024/01/pocket-pm25.jpg",
                url: "https://www.pranaair.com/air-quality-monitor/handheld/pocket-monitor/",
              },
              {
                name: "Nano CO Monitor",
                slug: "nano-co-monitor",
                image: "https://www.pranaair.com/wp-content/uploads/2024/01/nano-co.jpg",
                url: "https://www.pranaair.com/air-quality-monitor/handheld/nano-co-monitor/",
              },
              {
                name: "Nano CO2 Monitor",
                slug: "nano-co2-monitor",
                image: "https://www.pranaair.com/wp-content/uploads/2024/01/nano-co2.jpg",
                url: "https://www.pranaair.com/air-quality-monitor/handheld/nano-co2-monitor/",
              },
              {
                name: "Nano TVOC Monitor",
                slug: "nano-tvoc-monitor",
                image: "https://www.pranaair.com/wp-content/uploads/2024/01/nano-tvoc.jpg",
                url: "https://www.pranaair.com/air-quality-monitor/handheld/nano-tvoc-monitor/",
              },
              {
                name: "Pocket CO2 Monitor",
                slug: "pocket-co2-monitor",
                image: "https://www.pranaair.com/wp-content/uploads/2024/01/pocket-co2.jpg",
                url: "https://www.pranaair.com/air-quality-monitor/pocket-co2-monitor/",
              },
              {
                name: "Oxygen Monitor",
                slug: "oxygen-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/oxygen-monitor/",
              },
            ],
          },
          {
            name: "Indoor",
            slug: "indoor",
            icon: "/icons/indoor.svg",
            products: [
              {
                name: "Cair Monitor",
                slug: "cair-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/cair-monitor/",
              },
              {
                name: "Squair Air Monitor",
                slug: "squair-air-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/squair-air-monitor/",
              },
              {
                name: "Sensible Air Monitor",
                slug: "sensible-air-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/sensible-air-monitor/",
              },
              {
                name: "Sensible Plus Air Monitor",
                slug: "sensible-plus-air-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/sensible-plus-air-monitor/",
              },
            ],
          },
          {
            name: "Outdoor",
            slug: "outdoor",
            icon: "/icons/outdoor.svg",
            products: [
              {
                name: "Air Drone",
                slug: "air-drone",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/air-drone/",
              },
              {
                name: "Weather Station",
                slug: "weather-station",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/weather-station/",
              },
              {
                name: "Ambient Air Monitor",
                slug: "ambient-air-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/ambient-air-monitor/",
              },
              {
                name: "Prana Sense",
                slug: "prana-sense",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/ambient-air-monitor/prana-sense/",
              },
              {
                name: "Rental Air Monitor",
                slug: "rental-air-monitor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-monitor/rental-air-monitor/",
              },
            ],
          },
        ],
      },
      {
        name: "Air Quality Sensors",
        slug: "air-quality-sensor",
        icon: "/icons/sensor.svg",
        subcategories: [
          {
            name: "PM Sensors",
            slug: "pm-sensors",
            icon: "/icons/pm-sensor.svg",
            products: [
              {
                name: "Outdoor PM Sensor",
                slug: "outdoor-pm-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/outdoor-pm-sensor/",
              },
              {
                name: "Indoor PM Sensor",
                slug: "indoor-pm-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/indoor-pm-sensor/",
              },
            ],
          },
          {
            name: "Gas Sensors",
            slug: "gas-sensors",
            icon: "/icons/gas-sensor.svg",
            products: [
              {
                name: "Hydrogen Sulfide (H2S) Sensor",
                slug: "hydrogen-sulfide-h2s-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/hydrogen-sulfide-h2s-sensor/",
              },
              {
                name: "Ethanol (EtOH) Sensor",
                slug: "ethanol-etoh-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/ethanol-etoh-sensor/",
              },
              {
                name: "Chlorine (Cl2) Sensor",
                slug: "chlorine-cl2-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/chlorine-cl2-sensor/",
              },
              {
                name: "Nitrogen Dioxide (NO2) Sensor",
                slug: "nitrogen-dioxide-no2-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/nitrogen-dioxide-no2-sensor/",
              },
              {
                name: "Carbon Dioxide (CO2) Sensor",
                slug: "carbon-dioxide-co2-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/carbon-dioxide-co2-sensor/",
              },
              {
                name: "Ozone (O3) Sensor",
                slug: "ozone-o3-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/ozone-o3-sensor/",
              },
              {
                name: "Ammonia (NH3) Sensor",
                slug: "ammonia-nh3-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/ammonia-nh3-sensor/",
              },
              {
                name: "Sulfur Dioxide (SO2) Sensor",
                slug: "sulfur-dioxide-so2-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/sulfur-dioxide-so2-sensor/",
              },
              {
                name: "Carbon Monoxide (CO) Sensor",
                slug: "carbon-monoxide-co-sensor",
                image: "/placeholder.svg?height=200&width=200",
                url: "https://www.pranaair.com/air-quality-sensor/carbon-monoxide-co-sensor/",
              },
            ],
          },
        ],
      },
      {
        name: "Air Quality PCBs",
        slug: "air-quality-pcb",
        icon: "/icons/pcb.svg",
        subcategories: [],
      },
      {
        name: "Weather Station",
        slug: "weather-station",
        icon: "/icons/weather.svg",
        subcategories: [],
      },
      {
        name: "Air Purifier",
        slug: "air-purifier",
        icon: "/icons/purifier.svg",
        subcategories: [
          {
            name: "Wearable Air Purifier",
            slug: "wearable-air-purifier",
            icon: "/icons/wearable.svg",
            products: [],
          },
          {
            name: "Air Sanitizer",
            slug: "air-sanitizer",
            icon: "/icons/sanitizer.svg",
            products: [],
          },
          {
            name: "Fresh Air Machine",
            slug: "fresh-air-machine",
            icon: "/icons/fresh-air.svg",
            products: [],
          },
          {
            name: "Outdoor Air Purifier",
            slug: "outdoor-air-purifier",
            icon: "/icons/outdoor-purifier.svg",
            products: [],
          },
        ],
      },
      {
        name: "Anti-Pollution Masks",
        slug: "anti-pollution-mask",
        icon: "/icons/mask.svg",
        subcategories: [
          {
            name: "2nd Gen Mask",
            slug: "2nd-gen-mask",
            icon: "/icons/mask-gen2.svg",
            products: [],
          },
          {
            name: "Adult-Kid Mask",
            slug: "adult-kid-mask",
            icon: "/icons/mask-family.svg",
            products: [],
          },
        ],
      },
      {
        name: "Air Filters",
        slug: "air-filter",
        icon: "/icons/filter.svg",
        subcategories: [
          {
            name: "Car Cabin Air Filter",
            slug: "car-cabin-air-filter",
            icon: "/icons/car-filter.svg",
            products: [],
          },
          {
            name: "Air Purifier Filter",
            slug: "air-purifier-filter",
            icon: "/icons/purifier-filter.svg",
            products: [],
          },
          {
            name: "Room AC Filter",
            slug: "room-ac-filter",
            icon: "/icons/ac-filter.svg",
            products: [],
          },
          {
            name: "2nd Gen Mask Filter",
            slug: "2nd-gen-mask-filter",
            icon: "/icons/mask-filter.svg",
            products: [],
          },
          {
            name: "Motion Mask Filter",
            slug: "motion-mask-filter",
            icon: "/icons/motion-mask-filter.svg",
            products: [],
          },
        ],
      },
    ],
  },
]
// Mock translations
const useTranslations = () => {
  return {
    t: (key) => key,
    locale: "en",
    setLocale: () => {},
    availableLocales: [{ code: "en", name: "English" }],
    getLocalizedPath: (path) => path,
  }
}

const headerStyles = `
.header-container {
position: fixed !important;
top: 0 !important;
left: 0 !important;
right: 0 !important;
background-color: white !important;
border-bottom: 1px solid #e5e7eb !important;
z-index: 1030 !important;
height: 70px !important;
margin-bottom: 0 !important;
}

body {
padding-top: 70px !important;
margin-top: 0 !important;
}

/* Ensure no gap between header and content */
main {
margin-top: 0 !important;
padding-top: 0 !important;
}

section:first-of-type {
margin-top: 0 !important;
}

.header-inner {
display: flex !important;
align-items: center !important;
justify-content: space-between !important;
height: 70px !important;
padding: 0 24px !important;
max-width: 1400px !important;
margin: 0 auto !important;
position: relative !important;
}

.logo-container {
display: flex !important;
align-items: center !important;
}

.logo-container img {
height: 46px !important;
width: auto !important;
}

.nav-container {
display: flex !important;
align-items: center !important;
justify-content: space-between !important;
flex: 1 !important;
margin-left: 48px !important;
}

.nav-list {
display: flex !important;
align-items: center !important;
gap: 32px !important;
margin: 0 !important;
padding: 0 !important;
list-style: none !important;
}

.nav-item {
position: relative !important;
}

.nav-link {
display: flex !important;
align-items: center !important;
gap: 4px !important;
color: #374151 !important;
font-size: 15px !important;
font-weight: 500 !important;
text-decoration: none !important;
padding: 6px 0 !important;
transition: color 0.2s !important;
}

.nav-link:hover {
color: #7ab261 !important;
}

.nav-link svg {
width: 16px !important;
height: 16px !important;
transition: transform 0.2s !important;
}

.nav-link:hover svg {
transform: rotate(180deg) !important;
}

.right-menu {
display: flex !important;
align-items: center !important;
gap: 24px !important;
}

.get-in-touch {
background-color: #7ab261 !important;
color: white !important;
font-size: 15px !important;
font-weight: 500 !important;
padding: 8px 20px !important;
border-radius: 4px !important;
text-decoration: none !important;
transition: background-color 0.2s !important;
}

.get-in-touch:hover {
background-color: #689152 !important;
}

.language-selector {
display: flex !important;
align-items: center !important;
gap: 6px !important;
color: #374151 !important;
font-size: 15px !important;
font-weight: 500 !important;
cursor: pointer !important;
padding: 6px !important;
border: none !important;
background: none !important;
}

.language-selector:hover {
color: #7ab261 !important;
}

.login-link {
color: #374151 !important;
font-size: 15px !important;
font-weight: 500 !important;
text-decoration: none !important;
transition: color 0.2s !important;
}

.login-link:hover {
color: #7ab261 !important;
}

.cart-link {
position: relative !important;
color: #374151 !important;
transition: color 0.2s !important;
}

.cart-link:hover {
color: #7ab261 !important;
}

.cart-badge {
position: absolute !important;
top: -6px !important;
right: -6px !important;
background-color: #7ab261 !important;
color: white !important;
font-size: 12px !important;
font-weight: 500 !important;
min-width: 18px !important;
height: 18px !important;
border-radius: 9999px !important;
display: flex !important;
align-items: center !important;
justify-content: center !important;
padding: 0 4px !important;
}

.currency-selector {
display: flex !important;
align-items: center !important;
gap: 4px !important;
color: #374151 !important;
font-size: 15px !important;
font-weight: 500 !important;
cursor: pointer !important;
padding: 6px !important;
border: none !important;
background: none !important;
}

.currency-selector:hover {
color: #7ab261 !important;
}

@media (max-width: 1024px) {
.nav-container {
margin-left: 24px !important;
}

.nav-list {
gap: 24px !important;
}

.right-menu {
gap: 16px !important;
}
}

@media (max-width: 768px) {
.header-inner {
padding: 0 16px !important;
}

.right-menu {
gap: 12px !important;
}

.get-in-touch {
padding: 6px 16px !important;
}
}

.mobile-menu-button {
display: none !important;
}

@media (max-width: 991px) {
.get-in-touch,
.language-selector {
  display: none !important;
}

.right-menu {
  gap: 8px !important;
}
}

/* Mobile menu styles update */
.mobile-menu {
position: fixed !important;
top: 0 !important;
left: 0 !important;
width: 100% !important;
height: 100% !important;
background: white !important;
z-index: 1050 !important;
overflow-y: auto !important;
padding: 0 !important;
}

.mobile-menu-header {
display: flex !important;
align-items: center !important;
justify-content: space-between !important;
padding: 16px !important;
border-bottom: 1px solid #e5e7eb !important;
}

.mobile-menu-close {
width: 40px !important;
height: 40px !important;
display: flex !important;
align-items: center !important;
justify-content: center !important;
background: #7ab261 !important;
border: none !important;
color: white !important;
border-radius: 4px !important;
}

.mobile-nav-item {
border-bottom: 1px solid #e5e7eb !important;
}

.mobile-nav-button {
width: 100% !important;
display: flex !important;
align-items: center !important;
justify-content: space-between !important;
padding: 20px 16px !important;
font-size: 18px !important;
color: #374151 !important;
background: none !important;
border: none !important;
text-align: left !important;
}

.mobile-nav-button.active {
color: #7ab261 !important;
}

/* Category Menu Styles */
.mobile-category-menu {
background: #f8f9fa !important;
}

.mobile-category-button {
width: 100% !important;
display: flex !important;
align-items: center !important;
gap: 12px !important;
padding: 20px 16px !important;
font-size: 18px !important;
color: #374151 !important;
background: #e2eadd !important;
border: none !important;
text-align: left !important;
}

.mobile-category-button img {
width: 24px !important;
height: 24px !important;
}

.mobile-category-button.active {
background: #7ab261 !important;
color: white !important;
}

/* Subcategory Menu Styles */
.mobile-subcategory-menu {
background: white !important;
}

.mobile-subcategory-button {
width: 100% !important;
display: flex !important;
align-items: center !important;
gap: 12px !important;
padding: 20px 16px !important;
font-size: 16px !important;
color: #374151 !important;
background: white !important;
border: none !important;
text-align: left !important;
border-bottom: 1px solid #e5e7eb !important;
}

/* Product Grid Styles */
.mobile-product-grid {
display: grid !important;
grid-template-columns: repeat(2, 1fr) !important;
gap: 16px !important;
padding: 16px !important;
background: white !important;
}

.mobile-product-card {
text-decoration: none !important;
color: inherit !important;
}

.mobile-product-image {
position: relative !important;
width: 100% !important;
aspect-ratio: 1 !important;
border-radius: 8px !important;
overflow: hidden !important;
margin-bottom: 8px !important;
}

.mobile-product-name {
font-size: 14px !important;
color: #374151 !important;
text-align: center !important;
}

.view-all-link {
display: flex !important;
align-items: center !important;
justify-content: space-between !important;
padding: 16px !important;
color: #374151 !important;
text-decoration: none !important;
background: white !important;
border-top: 1px solid #e5e7eb !important;
}

.mega-menu-container {
position: fixed !important;
top: 70px !important;
left: 0 !important;
right: 0 !important;
z-index: 1040 !important;
opacity: 0 !important;
visibility: hidden !important;
transform: translateY(-10px) !important;
transition: all 0.2s !important;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
background: white !important;
}

.mega-menu-container.active {
opacity: 1 !important;
visibility: visible !important;
transform: translateY(0) !important;
}

.nav-item:hover .mega-menu-container {
opacity: 1 !important;
visibility: visible !important;
transform: translateY(0) !important;
}

.nav-item {
position: relative !important;
}

.nav-item:hover .nav-link {
color: #7ab261 !important;
}

.nav-item:hover .nav-link svg {
transform: rotate(180deg) !important;
}

/* Reduce gap between header and hero section */
.header-container {
margin-bottom: -10px !important;
}

body {
margin-top: -10px !important;
}

@media (max-width: 991px) {
.mobile-menu-button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 40px !important;
  height: 40px !important;
  padding: 0 !important;
  border: none !important;
  background: none !important;
  color: #374151 !important;
  cursor: pointer !important;
}

.nav-container {
  display: none !important;
}
}
`

function MainHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSubcategory, setActiveSubcategory] = useState(null)
  const [activeMobileMenu, setActiveMobileMenu] = useState(null)
  const { cart } = useCart()
  const itemCount = cart?.length || 0
  const pathname = usePathname()
  const megaMenuRef = useRef(null)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const languageDropdownRef = useRef(null)
  const { locale, setLocale, availableLocales } = useTranslations()
  const { getLocalizedPath } = useTranslations()

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setActiveMobileMenu(null)
      }

      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const mainNavItems = [
    { label: "Solutions", href: "/solutions", hasDropdown: true },
    { label: "Products", href: "/products", hasDropdown: true },
    { label: "Case Studies", href: "/case-studies", hasDropdown: true },
    { label: "Know What", href: "/know-what", hasDropdown: true },
    { label: "About", href: "/about", hasDropdown: true },
  ]

  // Get the products mega menu data from our navigation file
  const productsMegaMenu = mainNavigation[0].megaMenu || []

  // Sample product data for the handheld category
  const handheldProducts = [
    {
      name: "Pocket PM2.5",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/pocket-pm25.jpg",
      slug: "pocket-pm25",
    },
    {
      name: "Pocket CO2",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/pocket-co2.jpg",
      slug: "pocket-co2",
    },
    {
      name: "OxyCO",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/oxyco.jpg",
      slug: "oxyco",
    },
    {
      name: "CO Detector",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/co-detector.jpg",
      slug: "co-detector",
    },
    {
      name: "Nano CO",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/nano-co.jpg",
      slug: "nano-co",
    },
    {
      name: "Nano CO2",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/nano-co2.jpg",
      slug: "nano-co2",
    },
    {
      name: "Nano TVOC",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/nano-tvoc.jpg",
      slug: "nano-tvoc",
    },
    {
      name: "Breathalyzer",
      image: "https://www.pranaair.com/wp-content/uploads/2024/01/breathalyzer.jpg",
      slug: "breathalyzer",
    },
  ]

  const handleCategoryClick = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null)
      setActiveSubcategory(null)
    } else {
      setActiveCategory(category)
      setActiveSubcategory(null)
    }
  }

  const handleSubcategoryClick = (subcategory) => {
    if (activeSubcategory === subcategory) {
      setActiveSubcategory(null)
    } else {
      setActiveSubcategory(subcategory)
    }
  }

  // Only use click handling for mobile
  const handleMobileNavClick = (label) => {
    if (activeMobileMenu === label) {
      setActiveMobileMenu(null)
    } else {
      setActiveMobileMenu(label)
    }
  }

  return (
    <>
      <style jsx global>
        {headerStyles}
      </style>
      <header className="header-container">
        <div className="header-inner">
          {/* Logo */}
          <Link href="/" className="logo-container">
            <Image
              src="https://www.pranaair.com/wp-content/uploads/2024/08/prana-air-logo.webp"
              alt="Prana Air"
              width={140}
              height={46}
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="nav-container">
            <ul className="nav-list">
              {mainNavItems.map((item) => (
                <li key={item.label} className="nav-item">
                  {item.hasDropdown ? (
                    <>
                      <Link href={item.href} className="nav-link">
                        {item.label}
                        <ChevronDown />
                      </Link>
                      {item.label === "Products" && (
                        <div className="mega-menu-container">
                          <MegaMenu categories={productsMegaMenu} onClose={() => {}} />
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} className="nav-link">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Menu */}
          <div className="right-menu">
            <Link href="/contact" className="get-in-touch">
              Get in touch
            </Link>

            <Link href="/my-account" className="login-link">
              My Account
            </Link>

            <Link href="/cart" className="cart-link">
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <Link href="/" className="logo-container">
              <Image
                src="https://www.pranaair.com/wp-content/uploads/2024/08/prana-air-logo.webp"
                alt="Prana Air"
                width={140}
                height={46}
                priority
              />
            </Link>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="mobile-nav-list">
            {/* Solutions */}
            <div className="mobile-nav-item">
              <button
                className={`mobile-nav-button ${activeCategory === "solutions" ? "active" : ""}`}
                onClick={() => handleCategoryClick("solutions")}
              >
                Solutions
                <ChevronDown className={`transition-transform ${activeCategory === "solutions" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Products */}
            <div className="mobile-nav-item">
              <button
                className={`mobile-nav-button ${activeCategory === "products" ? "active" : ""}`}
                onClick={() => handleCategoryClick("products")}
              >
                Products
                <ChevronDown className={`transition-transform ${activeCategory === "products" ? "rotate-180" : ""}`} />
              </button>

              {activeCategory === "products" && (
                <div className="mobile-category-menu">
                  {/* Air Quality Monitors */}
                  <button
                    className={`mobile-category-button ${activeSubcategory === "monitors" ? "active" : ""}`}
                    onClick={() => handleSubcategoryClick("monitors")}
                  >
                    <img src="/icons/monitor.svg" alt="" width={24} height={24} />
                    Air Quality Monitors
                    <ChevronDown
                      className={`ml-auto transition-transform ${activeSubcategory === "monitors" ? "rotate-180" : ""}`}
                    />
                  </button>

                  {activeSubcategory === "monitors" && (
                    <>
                      {/* Handheld Category */}
                      <button className="mobile-subcategory-button" onClick={() => handleSubcategoryClick("handheld")}>
                        <img src="/icons/handheld.svg" alt="" width={24} height={24} />
                        Handheld
                        <ChevronDown
                          className={`ml-auto transition-transform ${activeSubcategory === "handheld" ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Product Grid */}
                      <div className="mobile-product-grid">
                        {handheldProducts.map((product) => (
                          <Link
                            key={product.slug}
                            href={`/product/${product.slug}`}
                            className="mobile-product-card"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="mobile-product-image">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={150}
                                height={150}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="mobile-product-name">{product.name}</div>
                          </Link>
                        ))}
                      </div>

                      {/* View All Link */}
                      <Link
                        href="/air-quality-monitors"
                        className="view-all-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        View All Monitors
                        <ChevronRight size={20} />
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Case Studies */}
            <div className="mobile-nav-item">
              <button
                className={`mobile-nav-button ${activeCategory === "case-studies" ? "active" : ""}`}
                onClick={() => handleCategoryClick("case-studies")}
              >
                Case Studies
                <ChevronDown
                  className={`transition-transform ${activeCategory === "case-studies" ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Know What */}
            <div className="mobile-nav-item">
              <button
                className={`mobile-nav-button ${activeCategory === "know-what" ? "active" : ""}`}
                onClick={() => handleCategoryClick("know-what")}
              >
                Know What
                <ChevronDown className={`transition-transform ${activeCategory === "know-what" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* About */}
            <div className="mobile-nav-item">
              <button
                className={`mobile-nav-button ${activeCategory === "about" ? "active" : ""}`}
                onClick={() => handleCategoryClick("about")}
              >
                About
                <ChevronDown className={`transition-transform ${activeCategory === "about" ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* My Account */}
            <div className="mobile-nav-item">
              <Link href="/my-account" className="mobile-nav-button">
                My Account
              </Link>
            </div>

            {/* Cart */}
            <div className="mobile-nav-item">
              <Link href="/cart" className="mobile-nav-button">
                Cart
                {itemCount > 0 && <span className="badge bg-success rounded-pill ms-2">{itemCount}</span>}
              </Link>
            </div>

            {/* Admin Dashboard (for admin users) */}
            <div className="mobile-nav-item">
              <Link href="/admin" className="mobile-nav-button">
                Admin Dashboard
              </Link>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="p-4 mt-4">
            <Link
              href="/contact"
              className="block w-full py-3 px-4 bg-[#7ab261] text-white text-center rounded-md font-medium"
            >
              Get in touch
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

// Export both as named export and default export
export { MainHeader }
export default MainHeader

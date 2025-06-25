"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { BarChartIcon, ShoppingBag, Package, Users, FileText, Settings, LogOut, ChevronDown } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [adminUser, setAdminUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminStr = localStorage.getItem("admin")
        if (adminStr) {
          const adminData = JSON.parse(adminStr)
          if (adminData && adminData.expiresAt && new Date(adminData.expiresAt) > new Date()) {
            setAdminUser(adminData)
          } else {
            localStorage.removeItem("admin")
            router.push("/admin/login")
          }
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Admin auth check failed:", error)
        localStorage.removeItem("admin")
        router.push("/admin/login")
      }
    }

    const timer = setTimeout(checkAdminAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  // Handle media query for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/admin/login")
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Get active tab based on current pathname
  const getActiveTab = () => {
    if (pathname === "/admin" || pathname === "/admin/") return "dashboard"
    if (pathname.startsWith("/admin/orders")) return "orders"
    if (pathname.startsWith("/admin/products")) return "products"
    if (pathname.startsWith("/admin/customers")) return "customers"
    if (pathname.startsWith("/admin/analytics")) return "analytics"
    if (pathname.startsWith("/admin/settings")) return "settings"
    return "dashboard"
  }

  const activeTab = getActiveTab()

  return (
    <div className="admin-dashboard bg-gray-50">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="sidebar-toggle shadow-lg z-50 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        onClick={toggleSidebar}
      >
        {sidebarCollapsed ? <ChevronDown size={20} /> : <ChevronDown size={20} className="rotate-180" />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar shadow-xl bg-white ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header border-b border-gray-100">
          <div className="logo">
            <span className="logo-icon bg-gradient-to-r from-blue-600 to-blue-700">PA</span>
            {!sidebarCollapsed && <span className="logo-text text-gray-800">Prana Air</span>}
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-menu">
            <button
              className={`menu-item transition-all duration-200 ${activeTab === "dashboard" ? "active bg-blue-50 text-blue-600" : ""}`}
              onClick={() => router.push("/admin")}
            >
              <BarChartIcon size={20} className={`menu-icon ${activeTab === "dashboard" ? "text-blue-600" : ""}`} />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>

            <button
              className={`menu-item transition-all duration-200 ${activeTab === "orders" ? "active bg-blue-50 text-blue-600" : ""}`}
              onClick={() => router.push("/admin/orders")}
            >
              <ShoppingBag size={20} className={`menu-icon ${activeTab === "orders" ? "text-blue-600" : ""}`} />
              {!sidebarCollapsed && <span>Orders</span>}
            </button>

            <button
              className={`menu-item transition-all duration-200 ${activeTab === "products" ? "active bg-blue-50 text-blue-600" : ""}`}
              onClick={() => router.push("/admin/products")}
            >
              <Package size={20} className={`menu-icon ${activeTab === "products" ? "text-blue-600" : ""}`} />
              {!sidebarCollapsed && <span>Products</span>}
            </button>

            <button
              className={`menu-item transition-all duration-200 ${activeTab === "customers" ? "active bg-blue-50 text-blue-600" : ""}`}
              onClick={() => router.push("/admin/customers")}
            >
              <Users size={20} className={`menu-icon ${activeTab === "customers" ? "text-blue-600" : ""}`} />
              {!sidebarCollapsed && <span>Customers</span>}
            </button>

            <button
              className={`menu-item transition-all duration-200 ${activeTab === "analytics" ? "active bg-blue-50 text-blue-600" : ""}`}
              onClick={() => router.push("/admin/analytics")}
            >
              <FileText size={20} className={`menu-icon ${activeTab === "analytics" ? "text-blue-600" : ""}`} />
              {!sidebarCollapsed && <span>Analytics</span>}
            </button>

            <button
              className={`menu-item transition-all duration-200 ${activeTab === "settings" ? "active bg-blue-50 text-blue-600" : ""}`}
              onClick={() => router.push("/admin/settings")}
            >
              <Settings size={20} className={`menu-icon ${activeTab === "settings" ? "text-blue-600" : ""}`} />
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
          </nav>
        </div>

        <div className="sidebar-footer border-t border-gray-100">
          <button
            className="logout-button bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
            onClick={handleLogout}
          >
            <LogOut size={20} className="menu-icon text-red-600" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>{children}</main>
    </div>
  )
}

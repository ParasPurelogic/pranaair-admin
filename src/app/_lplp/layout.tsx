"use client"

import type React from "react"

import AdminLayout from "@/components/admin/admin-layout"
import "./dashboard.css"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

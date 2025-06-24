"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Truck, Package, ShoppingBag, ArrowLeft } from "lucide-react"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get order details from localStorage
    if (typeof window !== "undefined" && orderId) {
      try {
        const savedOrders = localStorage.getItem("orders")
        if (savedOrders) {
          const orders = JSON.parse(savedOrders)
          const foundOrder = orders.find((o) => o.id === orderId)
          setOrder(foundOrder || { id: orderId })
        }
      } catch (error) {
        console.error("Failed to get order details:", error)
      }
    }

    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ marginTop: "80px" }}>
        <div className="animate-pulse flex flex-col items-center">
          <Package className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl" style={{ marginTop: "80px" }}>
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{orderId}</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Processing</span>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-1">Order Date: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">
              Estimated Delivery: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Order Placed</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Package className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Processing</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Shipped</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Delivered</span>
              </div>
            </div>

            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div className="h-full bg-green-500" style={{ width: "15%" }}></div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-6 text-gray-600">
            We've sent a confirmation email to your email address with all the details of your order.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>

            <Link
              href="/my-account"
              className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

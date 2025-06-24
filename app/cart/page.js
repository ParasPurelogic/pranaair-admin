"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartProvider"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, calculateTotal, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  // Calculate cart totals
  const subtotal = calculateTotal ? calculateTotal() : 0
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - discount

  useEffect(() => {
    // Simulate faster loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "prana10") {
      setDiscount(subtotal * 0.1)
      setCouponApplied(true)
    } else {
      alert("Invalid coupon code")
    }
  }

  const handleProceedToCheckout = () => {
    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ marginTop: "80px" }}>
        <div className="animate-pulse flex flex-col items-center">
          <ShoppingBag className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl" style={{ marginTop: "80px" }}>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link
              href="/"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" style={{ marginTop: "80px" }}>
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Cart Items ({cart.length})</h2>
                <button
                  onClick={() => clearCart()}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mb-4 sm:mb-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=80&width=80&query=product"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="sm:ml-6 flex-grow">
                    <h3 className="text-base font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.category} | {item.color || "Standard"}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-center min-w-[40px]">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 font-medium text-right">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Have a coupon?</h2>
            <div className="flex">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={couponApplied}
              />
              <button
                onClick={handleApplyCoupon}
                className={`px-4 py-2 font-medium rounded-r-md ${
                  couponApplied ? "bg-gray-300 text-gray-700" : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={couponApplied}
              >
                {couponApplied ? "Applied" : "Apply"}
              </button>
            </div>
            {couponApplied && (
              <p className="text-green-600 text-sm mt-2">Coupon applied! You saved ${discount.toFixed(2)}</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                {shipping > 0 ? <span>${shipping.toFixed(2)}</span> : <span className="text-green-600">Free</span>}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center"
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <div className="mt-6">
              <Link href="/" className="text-green-600 hover:text-green-800 text-sm font-medium">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

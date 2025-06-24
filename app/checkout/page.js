"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartProvider"
import { useAuth } from "@/context/AuthProvider"
import { CheckCircle, CreditCard, ShoppingBag, Truck, User, MapPin, ChevronRight } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, calculateTotal, clearCart } = useCart()
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  // Calculate cart totals
  const subtotal = calculateTotal ? calculateTotal() : 0
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(" ")[0] || "",
    lastName: currentUser?.name?.split(" ")[1] || "",
    email: currentUser?.email || "",
    address: currentUser?.address?.split(",")[0] || "",
    city: currentUser?.address?.split(",")[1]?.trim() || "",
    state: currentUser?.address?.split(",")[2]?.trim() || "",
    zip: currentUser?.address?.split(",")[3]?.trim() || "",
    country: "United States",
    sameShipping: true,
    saveInfo: true,
    paymentMethod: "creditCard",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    codConfirm: false,
  })

  useEffect(() => {
    // Simulate faster loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  const validateShippingForm = () => {
    const errors = {}

    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Email is invalid"
    if (!formData.address.trim()) errors.address = "Address is required"
    if (!formData.city.trim()) errors.city = "City is required"
    if (!formData.state.trim()) errors.state = "State is required"
    if (!formData.zip.trim()) errors.zip = "ZIP code is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePaymentForm = () => {
    const errors = {}

    if (formData.paymentMethod === "creditCard") {
      if (!formData.cardName.trim()) errors.cardName = "Name on card is required"
      if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required"
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Card number must be 16 digits"
      if (!formData.cardExpiry.trim()) errors.cardExpiry = "Expiration date is required"
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) errors.cardExpiry = "Use format MM/YY"
      if (!formData.cardCvv.trim()) errors.cardCvv = "Security code is required"
      if (!/^\d{3,4}$/.test(formData.cardCvv)) errors.cardCvv = "CVV must be 3 or 4 digits"
    } else if (formData.paymentMethod === "cod" && !formData.codConfirm) {
      errors.codConfirm = "You must confirm you will have the exact amount ready"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add this function after the validatePaymentForm function
  const saveOrderToLocalStorage = (orderData) => {
    try {
      // Get existing orders
      const existingOrders = localStorage.getItem("orders")
      const orders = existingOrders ? JSON.parse(existingOrders) : []

      // Create new order
      const newOrder = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        customer: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        date: new Date().toISOString().split("T")[0],
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        payment: {
          method: formData.paymentMethod,
          // Don't store sensitive card details in localStorage
          cardLast4: formData.paymentMethod === "creditCard" ? formData.cardNumber.slice(-4) : null,
        },
        total: total,
        status: "pending",
      }

      // Add to orders array
      orders.unshift(newOrder)

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(orders))

      // Trigger storage event for admin dashboard
      window.dispatchEvent(new Event("storage"))

      return newOrder.id
    } catch (error) {
      console.error("Error saving order:", error)
      return null
    }
  }

  // Update the handleSubmitOrder function to save the order
  const handleSubmitOrder = (e) => {
    e.preventDefault()
    if (validatePaymentForm()) {
      setIsSubmitting(true)

      // Save order to localStorage
      const orderId = saveOrderToLocalStorage()

      // Simulate order processing
      setTimeout(() => {
        setIsSubmitting(false)
        clearCart()
        router.push(`/order-confirmation?orderId=${orderId}`)
      }, 1500)
    }
  }

  const handleContinueToPayment = (e) => {
    e.preventDefault()
    if (validateShippingForm()) {
      setActiveStep(2)
      window.scrollTo(0, 0)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ marginTop: "80px" }}>
        <div className="animate-pulse flex flex-col items-center">
          <Truck className="h-12 w-12 text-green-500 mb-4" />
          <p className="text-lg font-medium">Preparing checkout...</p>
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
            <p className="text-gray-600 mb-8">You need to add items to your cart before checking out.</p>
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
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className={`flex flex-col items-center ${activeStep >= 1 ? "text-green-500" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                activeStep >= 1 ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Cart</span>
          </div>
          <div className={`flex-grow border-t-2 mx-4 ${activeStep >= 2 ? "border-green-500" : "border-gray-200"}`} />
          <div className={`flex flex-col items-center ${activeStep >= 2 ? "text-green-500" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                activeStep >= 2 ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Shipping</span>
          </div>
          <div className={`flex-grow border-t-2 mx-4 ${activeStep >= 3 ? "border-green-500" : "border-gray-200"}`} />
          <div className={`flex flex-col items-center ${activeStep >= 3 ? "text-green-500" : "text-gray-400"}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                activeStep >= 3 ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {activeStep === 1 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <User className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>

                <form onSubmit={handleContinueToPayment}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.firstName ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        required
                      />
                      {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.lastName ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        required
                      />
                      {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                      required
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.address ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                      required
                    />
                    {formErrors.address && <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.city ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        required
                      />
                      {formErrors.city && <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.state ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        required
                      />
                      {formErrors.state && <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>}
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          formErrors.zip ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                        required
                      />
                      {formErrors.zip && <p className="mt-1 text-sm text-red-500">{formErrors.zip}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="India">India</option>
                    </select>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="sameShipping"
                      name="sameShipping"
                      checked={formData.sameShipping}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sameShipping" className="ml-2 text-sm text-gray-700">
                      Shipping address is the same as my billing address
                    </label>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
                      Save this information for next time
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Link
                      href="/cart"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                    >
                      Continue to Payment
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeStep === 2 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                </div>

                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-6">
                    <div className="flex space-x-4 mb-4">
                      <div
                        className={`flex-1 p-4 border rounded-md cursor-pointer ${
                          formData.paymentMethod === "creditCard"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-green-300"
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: "creditCard" })}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="creditCard"
                            name="paymentMethod"
                            value="creditCard"
                            checked={formData.paymentMethod === "creditCard"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                          />
                          <label htmlFor="creditCard" className="ml-2 flex items-center cursor-pointer">
                            <span className="font-medium">Credit Card</span>
                            <div className="flex ml-auto space-x-2">
                              <Image
                                src="/passport-visa-stamps.png"
                                alt="Visa"
                                width={40}
                                height={30}
                                className="object-contain"
                              />
                              <Image
                                src="/global-payments-network.png"
                                alt="Mastercard"
                                width={40}
                                height={30}
                                className="object-contain"
                              />
                              <Image
                                src="/amex-logo-display.png"
                                alt="American Express"
                                width={40}
                                height={30}
                                className="object-contain"
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                      <div
                        className={`flex-1 p-4 border rounded-md cursor-pointer ${
                          formData.paymentMethod === "paypal"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300 hover:border-green-300"
                        }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: "paypal" })}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="paypal"
                            name="paymentMethod"
                            value="paypal"
                            checked={formData.paymentMethod === "paypal"}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                          />
                          <label htmlFor="paypal" className="ml-2 flex items-center cursor-pointer">
                            <span className="font-medium">PayPal</span>
                            <div className="ml-auto">
                              <Image
                                src="/digital-wallet-transfer.png"
                                alt="PayPal"
                                width={60}
                                height={30}
                                className="object-contain"
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-md cursor-pointer mb-4 ${
                        formData.paymentMethod === "cod"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-green-300"
                      }`}
                      onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="cod"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleChange}
                          className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor="cod" className="ml-2 flex items-center cursor-pointer w-full">
                          <span className="font-medium">Cash on Delivery</span>
                          <div className="ml-auto">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-green-600"
                            >
                              <rect x="2" y="6" width="20" height="12" rx="2" />
                              <circle cx="12" cy="12" r="2" />
                              <path d="M6 12h.01M18 12h.01" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    </div>

                    {formData.paymentMethod === "creditCard" && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              formErrors.cardName ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder="John Smith"
                            required
                          />
                          {formErrors.cardName && <p className="mt-1 text-sm text-red-500">{formErrors.cardName}</p>}
                        </div>
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border ${
                              formErrors.cardNumber ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                          {formErrors.cardNumber && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.cardNumber}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border ${
                                formErrors.cardExpiry ? "border-red-500" : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                            />
                            {formErrors.cardExpiry && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.cardExpiry}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                              Security Code (CVV)
                            </label>
                            <input
                              type="text"
                              id="cardCvv"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border ${
                                formErrors.cardCvv ? "border-red-500" : "border-gray-300"
                              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                              placeholder="123"
                              maxLength={4}
                              required
                            />
                            {formErrors.cardCvv && <p className="mt-1 text-sm text-red-500">{formErrors.cardCvv}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === "paypal" && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          You will be redirected to PayPal to complete your payment securely.
                        </p>
                      </div>
                    )}

                    {formData.paymentMethod === "cod" && (
                      <div className="mt-4 p-4 bg-green-50 rounded-md">
                        <p className="text-sm text-green-800 font-medium">Cash on Delivery</p>
                        <p className="text-sm text-green-700 mt-1">
                          Pay with cash when your order is delivered. Our delivery agent will collect the payment.
                        </p>
                        <div className="mt-3 flex items-center">
                          <input
                            type="checkbox"
                            id="codConfirm"
                            name="codConfirm"
                            checked={formData.codConfirm || false}
                            onChange={(e) => setFormData({ ...formData, codConfirm: e.target.checked })}
                            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                            required={formData.paymentMethod === "cod"}
                          />
                          <label htmlFor="codConfirm" className="ml-2 text-sm text-green-800">
                            I confirm that I will have the exact amount ready for payment upon delivery
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Processing...</span>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        </>
                      ) : (
                        <>
                          Complete Order
                          <CheckCircle className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="max-h-60 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=64&width=64&query=product"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-bl-md px-1">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                {shipping > 0 ? <span>${shipping.toFixed(2)}</span> : <span className="text-green-600">Free</span>}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Truck className="h-4 w-4 mr-2 text-green-500" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-green-500" />
                <span>Delivery estimate: 3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

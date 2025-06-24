"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, subtotal, estimatedTax, shippingCost, total, clearCart } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setPaymentData({
        ...paymentData,
        [name]: formattedValue,
      })
    } else {
      setPaymentData({
        ...paymentData,
        [name]: value,
      })
    }

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!paymentData.cardName.trim()) errors.cardName = "Name on card is required"
    if (!paymentData.cardNumber.trim()) errors.cardNumber = "Card number is required"
    if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) errors.cardNumber = "Card number must be 16 digits"
    if (!paymentData.expMonth) errors.expMonth = "Expiration month is required"
    if (!paymentData.expYear) errors.expYear = "Expiration year is required"
    if (!paymentData.cvv.trim()) errors.cvv = "CVV is required"
    if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) errors.cvv = "CVV must be 3 or 4 digits"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".is-invalid")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)

      // Clear cart after successful payment
      setTimeout(() => {
        clearCart()
        router.push("/my-account")
      }, 3000)
    }, 2000)
  }

  if (cartItems.length === 0 && !paymentSuccess) {
    return (
      <div className="container py-5" style={{ marginTop: "80px" }}>
        <div className="alert alert-warning" role="alert">
          Your cart is empty. Please add items to your cart before proceeding to payment.
        </div>
        <div className="text-center mt-4">
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container py-5" style={{ marginTop: "80px" }}>
        <div className="card border-success">
          <div className="card-body text-center py-5">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                className="text-success"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
            </div>
            <h3 className="text-success">Payment Successful!</h3>
            <p className="mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="mb-4">You will be redirected to your account page shortly...</p>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      <h1 className="mb-4">Payment</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Payment Details</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="cardName" className="form-label">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.cardName ? "is-invalid" : ""}`}
                    id="cardName"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.cardName && <div className="invalid-feedback">{formErrors.cardName}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.cardNumber ? "is-invalid" : ""}`}
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength="19"
                    required
                  />
                  {formErrors.cardNumber && <div className="invalid-feedback">{formErrors.cardNumber}</div>}
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label htmlFor="expMonth" className="form-label">
                      Expiration Month
                    </label>
                    <select
                      className={`form-select ${formErrors.expMonth ? "is-invalid" : ""}`}
                      id="expMonth"
                      name="expMonth"
                      value={paymentData.expMonth}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    {formErrors.expMonth && <div className="invalid-feedback">{formErrors.expMonth}</div>}
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="expYear" className="form-label">
                      Expiration Year
                    </label>
                    <select
                      className={`form-select ${formErrors.expYear ? "is-invalid" : ""}`}
                      id="expYear"
                      name="expYear"
                      value={paymentData.expYear}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() + i}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                    {formErrors.expYear && <div className="invalid-feedback">{formErrors.expYear}</div>}
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.cvv ? "is-invalid" : ""}`}
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleChange}
                      placeholder="XXX"
                      maxLength="4"
                      required
                    />
                    {formErrors.cvv && <div className="invalid-feedback">{formErrors.cvv}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">We accept:</span>
                    <div className="payment-card-icons">
                      <div className="payment-card-icon">
                        <span className="fw-bold">Visa</span>
                      </div>
                      <div className="payment-card-icon">
                        <span className="fw-bold">MC</span>
                      </div>
                      <div className="payment-card-icon">
                        <span className="fw-bold">Amex</span>
                      </div>
                      <div className="payment-card-icon">
                        <span className="fw-bold">PayPal</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <h5 className="mb-3">Billing Address</h5>
                <p>123 Main Street, Anytown, CA 12345, United States</p>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-success" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing Payment...
                      </>
                    ) : (
                      "Complete Payment"
                    )}
                  </button>
                  <Link href="/checkout" className="btn btn-outline-secondary">
                    Back to Checkout
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>

              {cartItems.map((item) => (
                <div key={item.id} className="order-summary-item">
                  <div className="order-summary-image">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="order-summary-details">
                    <h6 className="mb-0">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                {shippingCost > 0 ? (
                  <span>${shippingCost.toFixed(2)}</span>
                ) : (
                  <span className="text-success">Free</span>
                )}
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-0">
                <strong>Total</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">Secure Payment</h5>
              <p className="mb-0 secure-payment-notice">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="me-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
                Your payment information is processed securely. We do not store credit card details nor have access to
                your credit card information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

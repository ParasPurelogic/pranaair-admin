"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "./login.css"

const CustomerLoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  // Check if customer is already logged in
  useEffect(() => {
    const checkCustomerAuth = () => {
      try {
        const customerStr = localStorage.getItem("customer")
        if (customerStr) {
          const customerData = JSON.parse(customerStr)
          // Check if token is still valid (not expired)
          if (customerData && customerData.expiresAt && new Date(customerData.expiresAt) > new Date()) {
            router.push("/my-account")
          } else {
            // Token expired, clear it
            localStorage.removeItem("customer")
            setIsCheckingAuth(false)
          }
        } else {
          setIsCheckingAuth(false)
        }
      } catch (error) {
        console.error("Customer auth check failed:", error)
        localStorage.removeItem("customer")
        setIsCheckingAuth(false)
      }
    }

    // Small delay to prevent immediate redirect that causes blinking
    const timer = setTimeout(checkCustomerAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  // Valid customer credentials
  const validCustomers = [{ email: "user@pranaair.com", password: "Us3r@2023!", name: "Regular User" }]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Find matching credentials
      const matchedCustomer = validCustomers.find((user) => user.email === email && user.password === password)

      if (matchedCustomer) {
        // Create customer data with expiration (24 hours)
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        const customerData = {
          id: `customer-${Date.now()}`,
          name: matchedCustomer.name,
          email: email,
          token: btoa(`${email}:${Date.now()}`), // Simple token for demo
          expiresAt: expiresAt.toISOString(),
        }

        // Store in localStorage - ONLY for customers
        localStorage.setItem("customer", JSON.stringify(customerData))

        // Redirect to customer account page
        setTimeout(() => {
          router.push("/my-account")
        }, 100)
      } else {
        setError("Invalid email or password")
        setLoading(false)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-loading">
            <div className="spinner"></div>
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Customer Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <Link href="/">Back to Home</Link>
          </p>
          <p>
            <Link href="/admin/login">Admin Login</Link>
          </p>
          <p className="login-note">
            Demo Credentials:
            <br />
            Customer: user@pranaair.com / Us3r@2023!
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomerLoginPage

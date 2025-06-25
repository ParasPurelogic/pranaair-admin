"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import "../../login/login.css"

const AdminLoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  // Check if admin is already logged in
  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminStr = localStorage.getItem("admin")
        if (adminStr) {
          const adminData = JSON.parse(adminStr)
          // Check if token is still valid (not expired)
          if (adminData && adminData.expiresAt && new Date(adminData.expiresAt) > new Date()) {
            router.push("/admin")
          } else {
            // Token expired, clear it
            localStorage.removeItem("admin")
            setIsCheckingAuth(false)
          }
        } else {
          setIsCheckingAuth(false)
        }
      } catch (error) {
        console.error("Admin auth check failed:", error)
        localStorage.removeItem("admin")
        setIsCheckingAuth(false)
      }
    }

    // Small delay to prevent immediate redirect that causes blinking
    const timer = setTimeout(checkAdminAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  // Valid admin credentials
  const validAdmins = [{ email: "admin@pranaair.com", password: "Pr@n@A1r2023!", name: "Admin User" }]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Find matching credentials
      const matchedAdmin = validAdmins.find((admin) => admin.email === email && admin.password === password)

      if (matchedAdmin) {
        // Create admin data with expiration (24 hours)
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        const adminData = {
          id: `admin-${Date.now()}`,
          name: matchedAdmin.name,
          email: email,
          token: btoa(`${email}:${Date.now()}`), // Simple token for demo
          expiresAt: expiresAt.toISOString(),
        }

        // Store in localStorage - ONLY for admins
        localStorage.setItem("admin", JSON.stringify(adminData))

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin")
        }, 100)
      } else {
        setError("Invalid admin credentials")
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
          <h1>Admin Login</h1>
          <p>Enter your admin credentials</p>
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
              placeholder="admin@pranaair.com"
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
            <Link href="/login">Customer Login</Link>
          </p>
          <p className="login-note">
            Demo Admin Credentials:
            <br />
            Email: admin@pranaair.com
            <br />
            Password: Pr@n@A1r2023!
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage

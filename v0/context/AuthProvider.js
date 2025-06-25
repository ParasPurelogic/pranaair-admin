"use client"

import { useContext, useState, useEffect, createContext } from "react"

// Create the context if it doesn't exist
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadUser = () => {
        const savedUserData = localStorage.getItem("user")
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData)

            // Check if the token has expired
            if (userData.expiresAt && new Date(userData.expiresAt) > new Date()) {
              setCurrentUser(userData)
            } else {
              // Clear expired data
              localStorage.removeItem("user")
            }
          } catch (error) {
            console.error("Failed to parse user from localStorage:", error)
            localStorage.removeItem("user")
          }
        }
        setLoading(false)
      }

      // Small delay to prevent immediate state changes that can cause UI flashing
      const timer = setTimeout(loadUser, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  // Mock login function
  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Strong credentials check with more secure comparison
      const validCredentials = [
        { email: "admin@pranaair.com", password: "Pr@n@A1r2023!", role: "admin", name: "Admin User" },
        { email: "user@pranaair.com", password: "Us3r@2023!", role: "user", name: "Regular User" },
      ]

      const matchedUser = validCredentials.find((user) => user.email === email && user.password === password)

      if (matchedUser) {
        // Create expiration date (24 hours from now)
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        // Create user data with secure token
        const userData = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
          name: matchedUser.name,
          email: email,
          role: matchedUser.role,
          token: btoa(`${email}:${Date.now()}`), // Simple token for demo
          lastLogin: new Date().toISOString(),
          expiresAt: expiresAt.toISOString(),
        }

        // Store user data
        setCurrentUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return { success: true, role: matchedUser.role }
      } else {
        // Add a small delay to prevent timing attacks
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  // Mock signup function
  const signup = async (name, email, password) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: "customer",
      }

      setCurrentUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  }

  // Check if user is admin
  const isAdmin = () => {
    return currentUser?.role === "admin"
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

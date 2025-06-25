"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, loading])

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        }
        return updatedCart
      } else {
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const itemCount = calculateTotalItems()

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    calculateTotalItems,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

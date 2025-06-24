"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  ShoppingBag,
  MapPin,
  CreditCard,
  User,
  LogOut,
  ChevronRight,
  Package,
  Clock,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Shield,
  KeyRound,
  Bell,
} from "lucide-react"
import "./my-account.css"

// Mock order history data
const mockOrders = [
  {
    id: "ORD-10042",
    date: "2023-11-15",
    status: "delivered",
    total: 249.99,
    items: [
      { id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 1, image: "/smart-home-air-monitor.png" },
      { id: 2, name: "Air Mask", price: 49.99, quantity: 2, image: "/urban-commute-mask.png" },
    ],
  },
  {
    id: "ORD-10036",
    date: "2023-10-28",
    status: "delivered",
    total: 399.99,
    items: [{ id: 3, name: "Fresh Air Machine", price: 399.99, quantity: 1, image: "/modern-air-purifier.png" }],
  },
  {
    id: "ORD-10021",
    date: "2023-09-12",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: 4,
        name: "Handheld Air Quality Monitor",
        price: 129.99,
        quantity: 1,
        image: "/handheld-air-quality-monitor.png",
      },
    ],
  },
]

// Mock address data
const mockAddresses = [
  {
    id: 1,
    type: "shipping",
    default: true,
    name: "Home Address",
    street: "123 Main Street",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "India",
    phone: "+91 98765 43210",
  },
  {
    id: 2,
    type: "billing",
    default: true,
    name: "Work Address",
    street: "456 Office Park",
    city: "Gurgaon",
    state: "Haryana",
    postalCode: "122001",
    country: "India",
    phone: "+91 98765 43211",
  },
]

// Mock payment methods
const mockPaymentMethods = [
  {
    id: 1,
    type: "credit",
    default: true,
    cardNumber: "**** **** **** 4242",
    expiryDate: "05/25",
    cardHolder: "John Doe",
  },
  {
    id: 2,
    type: "debit",
    default: false,
    cardNumber: "**** **** **** 5678",
    expiryDate: "09/24",
    cardHolder: "John Doe",
  },
]

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [customerData, setCustomerData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if customer is logged in
    const checkCustomerAuth = () => {
      try {
        const customerStr = localStorage.getItem("customer")
        if (customerStr) {
          const customerData = JSON.parse(customerStr)
          // Check if token is still valid (not expired)
          if (customerData && customerData.expiresAt && new Date(customerData.expiresAt) > new Date()) {
            setCustomerData(customerData)

            // Load customer data
            const nameParts = customerData.name ? customerData.name.split(" ") : ["User", ""]
            setProfile({
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              email: customerData.email || "",
              phone: "+91 98765 43210", // Mock phone number
            })

            setOrders(mockOrders)
            setAddresses(mockAddresses)
            setPaymentMethods(mockPaymentMethods)
            setIsLoading(false)
          } else {
            // Token expired, redirect to login
            localStorage.removeItem("customer")
            router.push("/login")
          }
        } else {
          // No customer token, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Customer auth check failed:", error)
        localStorage.removeItem("customer")
        router.push("/login")
      }
    }

    // Small delay to prevent immediate redirects that can cause UI flashing
    const timer = setTimeout(checkCustomerAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  const handleLogout = () => {
    // Clear customer data
    localStorage.removeItem("customer")
    // Redirect to customer login
    router.push("/login")
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // In a real app, this would be an API call to update the profile
    setIsEditing(false)
    // Show success message
    alert("Profile updated successfully!")
  }

  const handleAddressDelete = (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((address) => address.id !== id))
    }
  }

  const handlePaymentDelete = (id) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
    }
  }

  const handleSetDefault = (type, id) => {
    if (type === "address") {
      const addressType = addresses.find((a) => a.id === id).type
      setAddresses(
        addresses.map((address) =>
          address.type === addressType ? { ...address, default: address.id === id } : address,
        ),
      )
    } else if (type === "payment") {
      setPaymentMethods(paymentMethods.map((method) => ({ ...method, default: method.id === id })))
    }
  }

  if (isLoading) {
    return (
      <div className="account-loading">
        <div className="spinner"></div>
        <p>Loading your account information...</p>
      </div>
    )
  }

  return (
    <div className="my-account-container">
      <div className="account-header">
        <div className="container">
          <h1>My Account</h1>
          <div className="breadcrumb">
            <span>
              <Link href="/">Home</Link>
            </span>
            <ChevronRight className="breadcrumb-icon" />
            <span>My Account</span>
          </div>
        </div>
      </div>

      <div className="container account-content">
        <div className="account-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>
            <div className="user-details">
              <h3>
                {profile.firstName} {profile.lastName}
              </h3>
              <p>{profile.email}</p>
            </div>
          </div>

          <nav className="account-nav">
            <button
              className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="nav-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="nav-icon" />
              <span>Orders</span>
            </button>
            <button
              className={`nav-link ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <MapPin className="nav-icon" />
              <span>Addresses</span>
            </button>
            <button
              className={`nav-link ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard className="nav-icon" />
              <span>Payment Methods</span>
            </button>
            <button
              className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="nav-icon" />
              <span>Profile</span>
            </button>
            <button className="nav-link logout" onClick={handleLogout}>
              <LogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        <div className="account-main">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="account-dashboard">
              <h2>Account Overview</h2>
              <p className="welcome-message">
                Welcome back, {profile.firstName}! Here's a summary of your recent activities.
              </p>

              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <div className="card-icon orders">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="card-content">
                    <h3>{orders.length}</h3>
                    <p>Total Orders</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon addresses">
                    <MapPin size={20} />
                  </div>
                  <div className="card-content">
                    <h3>{addresses.length}</h3>
                    <p>Saved Addresses</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon payments">
                    <CreditCard size={20} />
                  </div>
                  <div className="card-content">
                    <h3>{paymentMethods.length}</h3>
                    <p>Payment Methods</p>
                  </div>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon notifications">
                    <Bell size={20} />
                  </div>
                  <div className="card-content">
                    <h3>2</h3>
                    <p>New Notifications</p>
                  </div>
                </div>
              </div>

              <div className="recent-orders">
                <div className="section-header">
                  <h3>Recent Orders</h3>
                  <button className="view-all" onClick={() => setActiveTab("orders")}>
                    View All Orders
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="order-list">
                    {orders.slice(0, 3).map((order) => (
                      <div className="order-card" key={order.id}>
                        <div className="order-header">
                          <div className="order-id-date">
                            <h4>Order #{order.id}</h4>
                            <div className="order-date">
                              <Clock size={14} className="date-icon" />
                              <span>{order.date}</span>
                            </div>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="order-items">
                          {order.items.map((item) => (
                            <div className="order-item" key={item.id}>
                              <div className="item-image">
                                <img src={item.image || "/placeholder.svg"} alt={item.name} />
                              </div>
                              <div className="item-details">
                                <h5>{item.name}</h5>
                                <div className="item-meta">
                                  <span className="item-quantity">Qty: {item.quantity}</span>
                                  <span className="item-price">₹{item.price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            <p>
                              Total: <span>₹{order.total.toFixed(2)}</span>
                            </p>
                          </div>
                          <div className="order-actions">
                            <button className="btn-outline">
                              <ExternalLink size={16} />
                              <span>Details</span>
                            </button>
                            <button className="btn-primary">Buy Again</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <Package size={48} />
                    </div>
                    <p>You haven't placed any orders yet.</p>
                    <Link href="/" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="account-orders">
              <h2>My Orders</h2>
              <p className="section-subtitle">Track and manage all your orders in one place</p>

              <div className="orders-filter">
                <div className="search-input">
                  <input type="text" placeholder="Search orders..." />
                </div>
                <div className="filter-select">
                  <select defaultValue="all">
                    <option value="all">All Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {orders.length > 0 ? (
                <div className="order-list">
                  {orders.map((order) => (
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <div className="order-id-date">
                          <h4>Order #{order.id}</h4>
                          <div className="order-date">
                            <Clock size={14} className="date-icon" />
                            <span>{order.date}</span>
                          </div>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items.map((item) => (
                          <div className="order-item" key={item.id}>
                            <div className="item-image">
                              <img src={item.image || "/placeholder.svg"} alt={item.name} />
                            </div>
                            <div className="item-details">
                              <h5>{item.name}</h5>
                              <div className="item-meta">
                                <span className="item-quantity">Qty: {item.quantity}</span>
                                <span className="item-price">₹{item.price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          <p>
                            Total: <span>₹{order.total.toFixed(2)}</span>
                          </p>
                        </div>
                        <div className="order-actions">
                          <button className="btn-outline">Track Order</button>
                          <button className="btn-outline">
                            <ExternalLink size={16} />
                            <span>Details</span>
                          </button>
                          <button className="btn-primary">Buy Again</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Package size={48} />
                  </div>
                  <p>You haven't placed any orders yet.</p>
                  <Link href="/" className="btn-primary">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="account-addresses">
              <div className="section-header">
                <div>
                  <h2>My Addresses</h2>
                  <p className="section-subtitle">Manage your shipping and billing addresses</p>
                </div>
                <button className="btn-primary add-new">
                  <Plus size={16} />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map((address) => (
                    <div className="address-card" key={address.id}>
                      {address.default && <div className="default-badge">Default {address.type}</div>}
                      <h4>{address.name}</h4>
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      <p className="address-phone">{address.phone}</p>

                      <div className="address-actions">
                        <button className="btn-icon">
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button className="btn-icon danger" onClick={() => handleAddressDelete(address.id)}>
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                        {!address.default && (
                          <button className="btn-primary" onClick={() => handleSetDefault("address", address.id)}>
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <MapPin size={48} />
                  </div>
                  <p>You haven't added any addresses yet.</p>
                  <button className="btn-primary">
                    <Plus size={16} />
                    <span>Add Your First Address</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "payments" && (
            <div className="account-payments">
              <div className="section-header">
                <div>
                  <h2>Payment Methods</h2>
                  <p className="section-subtitle">Manage your saved payment options</p>
                </div>
                <button className="btn-primary add-new">
                  <Plus size={16} />
                  <span>Add Payment Method</span>
                </button>
              </div>

              {paymentMethods.length > 0 ? (
                <div className="payment-list">
                  {paymentMethods.map((method) => (
                    <div className="payment-card" key={method.id}>
                      {method.default && <div className="default-badge">Default</div>}
                      <div className="card-type">
                        <div className={`card-logo ${method.type}`}>
                          <CreditCard size={20} />
                        </div>
                        <span>{method.type === "credit" ? "Credit Card" : "Debit Card"}</span>
                      </div>
                      <h4>{method.cardNumber}</h4>
                      <p>Expires: {method.expiryDate}</p>
                      <p>Card Holder: {method.cardHolder}</p>

                      <div className="payment-actions">
                        <button className="btn-icon">
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button className="btn-icon danger" onClick={() => handlePaymentDelete(method.id)}>
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                        {!method.default && (
                          <button className="btn-primary" onClick={() => handleSetDefault("payment", method.id)}>
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <CreditCard size={48} />
                  </div>
                  <p>You haven't added any payment methods yet.</p>
                  <button className="btn-primary">
                    <Plus size={16} />
                    <span>Add Your First Payment Method</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="account-profile">
              <h2>My Profile</h2>
              <p className="section-subtitle">Manage your personal information and security settings</p>

              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-section">
                  <h3 className="form-section-title">Personal Information</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-actions">
                    {isEditing ? (
                      <>
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                        <button type="button" className="btn-outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-primary edit-profile" onClick={() => setIsEditing(true)}>
                        <Edit size={16} />
                        <span>Edit Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>

              <div className="account-security">
                <h3 className="security-title">
                  <Shield size={18} />
                  <span>Account Security</span>
                </h3>

                <div className="security-option">
                  <div>
                    <h4>Password</h4>
                    <p>Last changed: 3 months ago</p>
                  </div>
                  <button className="btn-outline security-action">
                    <KeyRound size={16} />
                    <span>Change Password</span>
                  </button>
                </div>

                <div className="security-option">
                  <div>
                    <h4>Two-Factor Authentication</h4>
                    <p>Status: Not Enabled</p>
                  </div>
                  <button className="btn-outline security-action">
                    <Shield size={16} />
                    <span>Enable 2FA</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAccountPage

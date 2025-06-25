"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "./dashboard.css"

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load Bootstrap JavaScript
    const loadBootstrap = async () => {
      if (typeof window !== "undefined") {
        try {
          await import("bootstrap/dist/js/bootstrap.bundle.min.js")
          console.log("Bootstrap JS loaded")
        } catch (error) {
          console.error("Failed to load Bootstrap JS:", error)
        }
      }
    }

    loadBootstrap()
  }, [])

  useEffect(() => {
    // Fetch orders from localStorage or use mock data
    const fetchOrders = () => {
      try {
        const savedOrders = localStorage.getItem("orders")
        let ordersData = savedOrders ? JSON.parse(savedOrders) : []

        // If no orders in localStorage, use mock data
        if (ordersData.length === 0) {
          ordersData = getMockOrders()
          localStorage.setItem("orders", JSON.stringify(ordersData))
        }

        setOrders(ordersData)

        // Calculate stats
        const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0)
        const pendingOrders = ordersData.filter(
          (order) => order.status === "pending" || order.status === "processing",
        ).length
        const completedOrders = ordersData.filter(
          (order) => order.status === "completed" || order.status === "delivered",
        ).length

        setStats({
          totalOrders: ordersData.length,
          totalRevenue,
          pendingOrders,
          completedOrders,
        })

        // Generate recent activity
        const activity = generateRecentActivity(ordersData)
        setRecentActivity(activity)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <p className="text-center mt-3">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav id="sidebar" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-cart me-2"></i>
                  Orders
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-box me-2"></i>
                  Products
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-people me-2"></i>
                  Customers
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-graph-up me-2"></i>
                  Reports
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-share me-1"></i> Share
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-download me-1"></i> Export
                </button>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <i className="bi bi-calendar me-1"></i> This week
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="row mb-4">
            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Orders</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalOrders}</div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-cart-check fs-2 text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Total Revenue</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">${stats.totalRevenue.toFixed(2)}</div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-currency-dollar fs-2 text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Pending Orders</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.pendingOrders}</div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-hourglass-split fs-2 text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Completed Orders</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.completedOrders}</div>
                    </div>
                    <div className="col-auto">
                      <i className="bi bi-check-circle fs-2 text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
                  <a href="#" className="btn btn-sm btn-primary">
                    View All
                  </a>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>
                              <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <Link href={`/admin/orders/${order.id}`} className="btn btn-sm btn-outline-primary me-2">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and Sales Chart */}
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Recent Activity</h6>
                </div>
                <div className="card-body">
                  <ul className="timeline">
                    {recentActivity.map((activity, index) => (
                      <li key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <h3 className="timeline-title">{activity.title}</h3>
                          <p>{activity.description}</p>
                          <p className="timeline-date">{activity.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Sales Overview</h6>
                </div>
                <div className="card-body">
                  <div className="chart-area">
                    <canvas id="salesChart" height="300"></canvas>
                    <div className="text-center mt-4">
                      <p className="text-muted">
                        This is a placeholder for a sales chart. In a real application, this would display actual sales
                        data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Helper function to get mock orders
function getMockOrders() {
  return [
    {
      id: "ORD-001",
      customer: "John Doe",
      email: "john@example.com",
      date: "2023-04-01",
      total: 299.99,
      status: "completed",
      items: [
        { id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 1 },
        { id: 2, name: "Wearable Air Purifier", price: 99.99, quantity: 1 },
        { id: 4, name: "Air Sanitizer", price: 49.99, quantity: 1 },
      ],
      shipping: {
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
      },
      payment: {
        method: "Credit Card",
        cardLast4: "4242",
      },
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      email: "jane@example.com",
      date: "2023-04-02",
      total: 199.99,
      status: "shipped",
      items: [{ id: 2, name: "Wearable Air Purifier", price: 99.99, quantity: 2 }],
      shipping: {
        address: "456 Oak St",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "USA",
      },
      payment: {
        method: "PayPal",
      },
    },
    {
      id: "ORD-003",
      customer: "Bob Johnson",
      email: "bob@example.com",
      date: "2023-04-03",
      total: 149.99,
      status: "processing",
      items: [{ id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 1 }],
      shipping: {
        address: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zip: "60007",
        country: "USA",
      },
      payment: {
        method: "Credit Card",
        cardLast4: "1234",
      },
    },
    {
      id: "ORD-004",
      customer: "Alice Williams",
      email: "alice@example.com",
      date: "2023-04-04",
      total: 249.98,
      status: "pending",
      items: [
        { id: 3, name: "HEPA Filter", price: 29.99, quantity: 2 },
        { id: 4, name: "Air Sanitizer", price: 49.99, quantity: 1 },
        { id: 5, name: "Replacement Filters", price: 19.99, quantity: 7 },
      ],
      shipping: {
        address: "321 Elm St",
        city: "Houston",
        state: "TX",
        zip: "77001",
        country: "USA",
      },
      payment: {
        method: "Credit Card",
        cardLast4: "5678",
      },
    },
    {
      id: "ORD-005",
      customer: "Charlie Brown",
      email: "charlie@example.com",
      date: "2023-04-05",
      total: 399.98,
      status: "delivered",
      items: [
        { id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 1 },
        { id: 2, name: "Wearable Air Purifier", price: 99.99, quantity: 1 },
        { id: 3, name: "HEPA Filter", price: 29.99, quantity: 5 },
      ],
      shipping: {
        address: "654 Maple St",
        city: "Phoenix",
        state: "AZ",
        zip: "85001",
        country: "USA",
      },
      payment: {
        method: "PayPal",
      },
    },
  ]
}

// Helper function to generate recent activity
function generateRecentActivity(orders) {
  const activities = []

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Generate activities from orders
  sortedOrders.slice(0, 5).forEach((order) => {
    activities.push({
      title: `New Order #${order.id}`,
      description: `${order.customer} placed an order for $${order.total.toFixed(2)}`,
      time: order.date,
    })

    if (order.status === "shipped") {
      activities.push({
        title: `Order Shipped #${order.id}`,
        description: `Order for ${order.customer} has been shipped`,
        time: order.date,
      })
    }

    if (order.status === "delivered" || order.status === "completed") {
      activities.push({
        title: `Order Completed #${order.id}`,
        description: `Order for ${order.customer} has been completed`,
        time: order.date,
      })
    }
  })

  // Sort activities by time (newest first) and limit to 5
  return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
}

// Helper function to get status badge color
function getStatusBadgeColor(status) {
  switch (status) {
    case "pending":
      return "warning"
    case "processing":
      return "info"
    case "shipped":
      return "primary"
    case "delivered":
      return "success"
    case "completed":
      return "success"
    case "cancelled":
      return "danger"
    case "refunded":
      return "secondary"
    default:
      return "secondary"
  }
}

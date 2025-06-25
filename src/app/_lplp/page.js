"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChartIcon,
  ShoppingBag,
  Package,
  Users,
  Search,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  ExternalLink,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Mail,
  Calendar,
  RefreshCw,
  Download,
  BarChart2,
  LineChart,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import "./dashboard.css"

// Replace the mockOrders array with this function to get orders from localStorage
const getOrdersFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const savedOrders = localStorage.getItem("orders")
      return savedOrders ? JSON.parse(savedOrders) : mockOrders
    } catch (error) {
      console.error("Failed to parse orders from localStorage:", error)
      return mockOrders
    }
  }
  return mockOrders
}

// Enhanced mock orders with more details
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-04-01",
    total: 299.99,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
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
      carrier: "FedEx",
      trackingNumber: "FDX7891234567",
      estimatedDelivery: "2023-04-05",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "4242",
      transactionId: "txn_1234567890",
      datePaid: "2023-04-01",
    },
    notes: "Customer requested gift wrapping",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-04-02",
    total: 149.5,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "PayPal",
    items: [
      { id: 2, name: "Wearable Air Purifier", price: 99.99, quantity: 1 },
      { id: 3, name: "Air Mask", price: 49.5, quantity: 1 },
    ],
    shipping: {
      address: "456 Park Ave",
      city: "Boston",
      state: "MA",
      zip: "02108",
      country: "USA",
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
    payment: {
      method: "PayPal",
      transactionId: "",
      datePaid: "",
    },
    notes: "",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    date: "2023-04-03",
    total: 599.99,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    items: [{ id: 5, name: "Fresh Air Machine", price: 299.99, quantity: 2 }],
    shipping: {
      address: "789 Broadway",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456784",
      estimatedDelivery: "2023-04-07",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "1234",
      transactionId: "txn_9876543210",
      datePaid: "2023-04-03",
    },
    notes: "Fragile items, handle with care",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2023-04-04",
    total: 89.99,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Credit Card",
    items: [{ id: 3, name: "Air Mask", price: 29.99, quantity: 3 }],
    shipping: {
      address: "321 Oak St",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "USA",
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "5678",
      transactionId: "txn_5678901234",
      datePaid: "2023-04-04",
      refundId: "ref_1234567",
      dateRefunded: "2023-04-05",
    },
    notes: "Customer requested cancellation due to wrong size",
  },
  {
    id: "ORD-005",
    customer: "Michael Brown",
    email: "michael@example.com",
    date: "2023-04-05",
    total: 199.99,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "PayPal",
    items: [{ id: 4, name: "Air Sanitizer", price: 199.99, quantity: 1 }],
    shipping: {
      address: "654 Pine St",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
    payment: {
      method: "PayPal",
      transactionId: "",
      datePaid: "",
    },
    notes: "",
  },
  {
    id: "ORD-006",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    date: "2023-04-06",
    total: 349.98,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    items: [
      { id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 1 },
      { id: 4, name: "Air Sanitizer", price: 199.99, quantity: 1 },
    ],
    shipping: {
      address: "987 Elm St",
      city: "Denver",
      state: "CO",
      zip: "80202",
      country: "USA",
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "9012",
      transactionId: "txn_3456789012",
      datePaid: "2023-04-06",
    },
    notes: "Priority shipping requested",
  },
  {
    id: "ORD-007",
    customer: "David Miller",
    email: "david@example.com",
    date: "2023-04-07",
    total: 129.99,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    items: [
      { id: 3, name: "Air Mask", price: 29.99, quantity: 1 },
      { id: 2, name: "Wearable Air Purifier", price: 99.99, quantity: 1 },
    ],
    shipping: {
      address: "753 Maple Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
      carrier: "USPS",
      trackingNumber: "9400111202000000000000",
      estimatedDelivery: "2023-04-12",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "3456",
      transactionId: "txn_6789012345",
      datePaid: "2023-04-07",
    },
    notes: "",
  },
  {
    id: "ORD-008",
    customer: "Jennifer Lee",
    email: "jennifer@example.com",
    date: "2023-04-08",
    total: 599.98,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    items: [{ id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 4 }],
    shipping: {
      address: "159 Cedar Rd",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "USA",
      carrier: "DHL",
      trackingNumber: "456789012345",
      estimatedDelivery: "2023-04-11",
    },
    payment: {
      method: "PayPal",
      transactionId: "txn_7890123456",
      datePaid: "2023-04-08",
    },
    notes: "Business address, deliver during business hours",
  },
  {
    id: "ORD-009",
    customer: "Thomas Anderson",
    email: "thomas@example.com",
    date: "2023-04-09",
    total: 299.99,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "Credit Card",
    items: [{ id: 5, name: "Fresh Air Machine", price: 299.99, quantity: 1 }],
    shipping: {
      address: "357 Birch St",
      city: "Portland",
      state: "OR",
      zip: "97201",
      country: "USA",
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "7890",
      transactionId: "",
      datePaid: "",
    },
    notes: "",
  },
  {
    id: "ORD-010",
    customer: "Lisa Garcia",
    email: "lisa@example.com",
    date: "2023-04-10",
    total: 179.98,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    items: [{ id: 3, name: "Air Mask", price: 29.99, quantity: 6 }],
    shipping: {
      address: "852 Walnut Blvd",
      city: "Philadelphia",
      state: "PA",
      zip: "19102",
      country: "USA",
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
    },
    payment: {
      method: "PayPal",
      transactionId: "txn_0123456789",
      datePaid: "2023-04-10",
    },
    notes: "Bulk order for office",
  },
  {
    id: "ORD-011",
    customer: "Kevin Martinez",
    email: "kevin@example.com",
    date: "2023-04-11",
    total: 449.98,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    items: [
      { id: 1, name: "Air Quality Monitor", price: 149.99, quantity: 1 },
      { id: 5, name: "Fresh Air Machine", price: 299.99, quantity: 1 },
    ],
    shipping: {
      address: "753 Spruce St",
      city: "Las Vegas",
      state: "NV",
      zip: "89101",
      country: "USA",
      carrier: "FedEx",
      trackingNumber: "FDX1234567890",
      estimatedDelivery: "2023-04-15",
    },
    payment: {
      method: "Credit Card",
      cardLast4: "2345",
      transactionId: "txn_2345678901",
      datePaid: "2023-04-11",
    },
    notes: "",
  },
  {
    id: "ORD-012",
    customer: "Amanda Taylor",
    email: "amanda@example.com",
    date: "2023-04-12",
    total: 99.99,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    items: [{ id: 2, name: "Wearable Air Purifier", price: 99.99, quantity: 1 }],
    shipping: {
      address: "159 Aspen Ct",
      city: "Nashville",
      state: "TN",
      zip: "37201",
      country: "USA",
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456785",
      estimatedDelivery: "2023-04-14",
    },
    payment: {
      method: "PayPal",
      transactionId: "txn_3456789012",
      datePaid: "2023-04-12",
    },
    notes: "Leave at front door",
  },
]

const mockProducts = [
  {
    id: 1,
    name: "Air Quality Monitor",
    sku: "AQM-001",
    price: 149.99,
    stock: 25,
    category: "Air Monitors",
    image: "/smart-home-air-quality.png",
  },
  {
    id: 2,
    name: "Wearable Air Purifier",
    sku: "WAP-002",
    price: 99.99,
    stock: 42,
    category: "Air Purifiers",
    image: "/urban-commute-air-shield.png",
  },
  {
    id: 3,
    name: "Air Mask",
    sku: "AM-003",
    price: 29.99,
    stock: 78,
    category: "Air Masks",
    image: "/futuristic-city-air-mask.png",
  },
  {
    id: 4,
    name: "Air Sanitizer",
    sku: "AS-004",
    price: 199.99,
    stock: 15,
    category: "Air Sanitizers",
    image: "/clean-air-device.png",
  },
  {
    id: 5,
    name: "Fresh Air Machine",
    sku: "FAM-005",
    price: 299.99,
    stock: 8,
    category: "Fresh Air Machines",
    image: "/indoor-garden-purifier.png",
  },
]

const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    address: "123 Main St, New York, NY 10001, USA",
    orders: 3,
    spent: 549.97,
    productsBought: ["Air Quality Monitor", "Wearable Air Purifier", "Air Sanitizer"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 9876543211",
    address: "456 Park Ave, Boston, MA 02108, USA",
    orders: 1,
    spent: 149.5,
    productsBought: ["Wearable Air Purifier"],
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+91 9876543212",
    address: "789 Broadway, Chicago, IL 60601, USA",
    orders: 2,
    spent: 699.98,
    productsBought: ["Fresh Air Machine"],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+91 9876543213",
    address: "321 Oak St, San Francisco, CA 94107, USA",
    orders: 1,
    spent: 89.99,
    productsBought: ["Air Mask"],
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+91 9876543214",
    address: "654 Pine St, Seattle, WA 98101, USA",
    orders: 4,
    spent: 799.96,
    productsBought: ["Air Sanitizer", "Air Quality Monitor"],
  },
  {
    id: 6,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+91 9876543215",
    address: "987 Elm St, Denver, CO 80202, USA",
    orders: 2,
    spent: 349.98,
    productsBought: ["Air Quality Monitor", "Air Sanitizer"],
  },
  {
    id: 7,
    name: "David Miller",
    email: "david@example.com",
    phone: "+91 9876543216",
    address: "753 Maple Ave, Austin, TX 78701, USA",
    orders: 2,
    spent: 129.99,
    productsBought: ["Air Mask", "Wearable Air Purifier"],
  },
  {
    id: 8,
    name: "Jennifer Lee",
    email: "jennifer@example.com",
    phone: "+91 9876543217",
    address: "159 Cedar Rd, Miami, FL 33101, USA",
    orders: 1,
    spent: 599.98,
    productsBought: ["Air Quality Monitor"],
  },
  {
    id: 9,
    name: "Thomas Anderson",
    email: "thomas@example.com",
    phone: "+91 9876543218",
    address: "357 Birch St, Portland, OR 97201, USA",
    orders: 1,
    spent: 299.99,
    productsBought: ["Fresh Air Machine"],
  },
  {
    id: 10,
    name: "Lisa Garcia",
    email: "lisa@example.com",
    phone: "+91 9876543219",
    address: "852 Walnut Blvd, Philadelphia, PA 19102, USA",
    orders: 1,
    spent: 179.98,
    productsBought: ["Air Mask"],
  },
  {
    id: 11,
    name: "Kevin Martinez",
    email: "kevin@example.com",
    phone: "+91 9876543220",
    address: "753 Spruce St, Las Vegas, NV 89101, USA",
    orders: 2,
    spent: 449.98,
    productsBought: ["Air Quality Monitor", "Fresh Air Machine"],
  },
  {
    id: 12,
    name: "Amanda Taylor",
    email: "amanda@example.com",
    phone: "+91 9876543221",
    address: "159 Aspen Ct, Nashville, TN 37201, USA",
    orders: 1,
    spent: 99.99,
    productsBought: ["Wearable Air Purifier"],
  },
  {
    id: 13,
    name: "Daniel Wilson",
    email: "daniel@example.com",
    phone: "+91 9876543222",
    address: "456 Oak Lane, Phoenix, AZ 85001, USA",
    orders: 3,
    spent: 349.97,
    productsBought: ["Air Quality Monitor", "Air Mask", "Air Sanitizer"],
  },
  {
    id: 14,
    name: "Olivia Martin",
    email: "olivia@example.com",
    phone: "+91 9876543223",
    address: "789 Pine Ave, Atlanta, GA 30301, USA",
    orders: 2,
    spent: 249.98,
    productsBought: ["Wearable Air Purifier", "Air Mask"],
  },
  {
    id: 15,
    name: "James Thompson",
    email: "james@example.com",
    phone: "+91 9876543224",
    address: "123 Maple St, Dallas, TX 75201, USA",
    orders: 1,
    spent: 299.99,
    productsBought: ["Fresh Air Machine"],
  },
  {
    id: 16,
    name: "Sophia Rodriguez",
    email: "sophia@example.com",
    phone: "+91 9876543225",
    address: "456 Elm Rd, Houston, TX 77001, USA",
    orders: 2,
    spent: 199.98,
    productsBought: ["Air Sanitizer", "Air Mask"],
  },
  {
    id: 17,
    name: "William Clark",
    email: "william@example.com",
    phone: "+91 9876543226",
    address: "789 Cedar Blvd, Detroit, MI 48201, USA",
    orders: 1,
    spent: 149.99,
    productsBought: ["Air Quality Monitor"],
  },
  {
    id: 18,
    name: "Ava Lewis",
    email: "ava@example.com",
    phone: "+91 9876543227",
    address: "321 Birch Ave, Minneapolis, MN 55401, USA",
    orders: 3,
    spent: 399.97,
    productsBought: ["Air Purifier", "Air Mask", "Air Sanitizer"],
  },
  {
    id: 19,
    name: "Benjamin Walker",
    email: "benjamin@example.com",
    phone: "+91 9876543228",
    address: "654 Walnut St, St. Louis, MO 63101, USA",
    orders: 2,
    spent: 249.98,
    productsBought: ["Air Quality Monitor", "Air Mask"],
  },
  {
    id: 20,
    name: "Mia Hall",
    email: "mia@example.com",
    phone: "+91 9876543229",
    address: "987 Spruce Rd, New Orleans, LA 70112, USA",
    orders: 1,
    spent: 99.99,
    productsBought: ["Wearable Air Purifier"],
  },
  {
    id: 21,
    name: "Ethan Young",
    email: "ethan@example.com",
    phone: "+91 9876543230",
    address: "753 Aspen Lane, Salt Lake City, UT 84101, USA",
    orders: 2,
    spent: 349.98,
    productsBought: ["Fresh Air Machine", "Air Sanitizer"],
  },
  {
    id: 22,
    name: "Isabella King",
    email: "isabella@example.com",
    phone: "+91 9876543231",
    address: "159 Oak Ct, Sacramento, CA 95814, USA",
    orders: 1,
    spent: 149.99,
    productsBought: ["Air Quality Monitor"],
  },
  {
    id: 23,
    name: "Alexander Scott",
    email: "alexander@example.com",
    phone: "+91 9876543232",
    address: "357 Pine Blvd, Indianapolis, IN 46204, USA",
    orders: 3,
    spent: 499.97,
    productsBought: ["Air Purifier", "Air Mask", "Air Quality Monitor"],
  },
  {
    id: 24,
    name: "Charlotte Green",
    email: "charlotte@example.com",
    phone: "+91 9876543233",
    address: "852 Maple Dr, Columbus, OH 43215, USA",
    orders: 2,
    spent: 199.98,
    productsBought: ["Air Sanitizer", "Air Mask"],
  },
  {
    id: 25,
    name: "Henry Adams",
    email: "henry@example.com",
    phone: "+91 9876543234",
    address: "753 Cedar Ave, Pittsburgh, PA 15222, USA",
    orders: 1,
    spent: 299.99,
    productsBought: ["Fresh Air Machine"],
  },
]

// Loading spinner component
const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="loading">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
)

// Main Admin Dashboard component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "Air Monitors", // Default category
    description: "",
    image: "",
    stockStatus: "in", // 'in' or 'out'
  })
  const [adminUser, setAdminUser] = useState(null)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [refreshing, setRefreshing] = useState(false)

  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })

  const [timeFilter, setTimeFilter] = useState("monthly")
  const [productFilter, setProductFilter] = useState("all")
  const [chartType, setChartType] = useState("bar")
  const [editingProduct, setEditingProduct] = useState(null)
  const [editedProduct, setEditedProduct] = useState({})
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productsPerPage] = useState(20)
  const [currentProductPage, setCurrentProductPage] = useState(1)
  const [productCategoryFilter, setProductCategoryFilter] = useState("all")
  const [customersPerPage] = useState(20)
  const [currentCustomerPage, setCurrentCustomerPage] = useState(1)

  // Calculate dashboard metrics
  const calculateMetrics = (ordersList) => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    // Total revenue
    const totalRevenue = ordersList.reduce(
      (sum, order) => (order.paymentStatus === "paid" ? sum + order.total : sum),
      0,
    )

    // Monthly revenue (last 30 days)
    const monthlyRevenue = ordersList.reduce((sum, order) => {
      const orderDate = new Date(order.date)
      return orderDate >= thirtyDaysAgo && orderDate <= today && order.paymentStatus === "paid"
        ? sum + order.total
        : sum
    }, 0)

    // Previous month revenue (30-60 days ago)
    const sixtyDaysAgo = new Date(today)
    sixtyDaysAgo.setDate(today.getDate() - 60)
    const prevMonthRevenue = ordersList.reduce((sum, order) => {
      const orderDate = new Date(order.date)
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo && order.paymentStatus === "paid"
        ? sum + order.total
        : sum
    }, 0)

    // Revenue change percentage
    const revenueChange = prevMonthRevenue === 0 ? 100 : ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100

    // Order counts by status
    const orderCounts = {
      total: ordersList.length,
      pending: ordersList.filter((order) => order.status === "pending").length,
      processing: ordersList.filter((order) => order.status === "processing").length,
      shipped: ordersList.filter((order) => order.status === "shipped").length,
      completed: ordersList.filter((order) => order.status === "completed").length,
      cancelled: ordersList.filter((order) => order.status === "cancelled").length,
    }

    // Monthly orders
    const monthlyOrders = ordersList.filter((order) => {
      const orderDate = new Date(order.date)
      return orderDate >= thirtyDaysAgo && orderDate <= today
    }).length

    // Previous month orders
    const prevMonthOrders = ordersList.filter((order) => {
      const orderDate = new Date(order.date)
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo
    }).length

    // Order change percentage
    const orderChange = prevMonthOrders === 0 ? 100 : ((monthlyOrders - prevMonthOrders) / prevMonthOrders) * 100

    return {
      totalRevenue,
      monthlyRevenue,
      revenueChange,
      orderCounts,
      monthlyOrders,
      orderChange,
    }
  }

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = () => {
      try {
        const adminStr = localStorage.getItem("admin")
        if (adminStr) {
          const adminData = JSON.parse(adminStr)
          // Check if token is still valid (not expired)
          if (adminData && adminData.expiresAt && new Date(adminData.expiresAt) > new Date()) {
            setAdminUser(adminData)
            // Load data
            setOrders(getOrdersFromStorage())
            setProducts(mockProducts)
            setCustomers(mockCustomers)
            setIsLoading(false)
          } else {
            // Token expired, redirect to login
            localStorage.removeItem("admin")
            router.push("/admin/login")
          }
        } else {
          // No admin token, redirect to login
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Admin auth check failed:", error)
        localStorage.removeItem("admin")
        router.push("/admin/login")
      }
    }

    // Small delay to prevent immediate redirects that can cause UI flashing
    const timer = setTimeout(checkAdminAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  // Add a new useEffect to listen for order updates
  useEffect(() => {
    const handleStorageChange = () => {
      setOrders(getOrdersFromStorage())
    }

    window.addEventListener("storage", handleStorageChange)

    // Check for orders every 30 seconds
    const interval = setInterval(() => {
      setOrders(getOrdersFromStorage())
    }, 30000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentProductPage(1) // Reset to first page when search changes
  }

  const refreshData = () => {
    setRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setOrders(getOrdersFromStorage())
      setRefreshing(false)
    }, 1000)
  }

  const applyDateFilter = (startDate, endDate) => {
    // In a real app, this would filter actual data from your API
    // For this demo, we'll simulate filtering by updating the state
    setRefreshing(true)

    // Simulate a short delay for the filter to apply
    setTimeout(() => {
      // If we had real data, we would filter it here based on the date range
      // For now, we'll just update the UI to show the filter is applied

      // Generate a date-specific seed for consistent "random" filtering
      const seed = startDate + endDate
      const seedNum = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

      // Use the seed to determine which items to filter out in a consistent way
      const filterFn = (item, index) => {
        if (!startDate && !endDate) return true

        // This is just for demo - in a real app you would compare actual dates
        // Here we're using a deterministic "random" filter based on the seed
        return (index + seedNum) % 3 !== 0
      }

      // Apply the filter to any data that needs to be updated
      // In a real app, you would filter your actual data sources

      setRefreshing(false)
    }, 500)
  }

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (productCategoryFilter === "all" || product.category === productCategoryFilter),
  )

  // Get current products for pagination
  const indexOfLastProduct = currentProductPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Change product page
  const paginateProducts = (pageNumber) => setCurrentProductPage(pageNumber)

  const filteredOrders = orders.filter(
    (order) =>
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (dateRange.start === "" || new Date(order.date) >= new Date(dateRange.start)) &&
      (dateRange.end === "" || new Date(dateRange.end)),
  )

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get current customers for pagination
  const indexOfLastCustomer = currentCustomerPage * customersPerPage
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)
  const totalCustomerPages = Math.ceil(filteredCustomers.length / customersPerPage)

  // Add this function for customer pagination
  const paginateCustomers = (pageNumber) => setCurrentCustomerPage(pageNumber)

  const handleAddProduct = (e) => {
    e.preventDefault()

    // Add new product to the list
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      sku: newProduct.sku,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
      category: newProduct.category,
      image: newProduct.image || `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(newProduct.name)}`,
      stockStatus: newProduct.stockStatus,
    }

    setProducts([...products, product])

    // Reset form and close modal
    setNewProduct({
      name: "",
      sku: "",
      price: "",
      stock: "",
      category: "Air Monitors",
      description: "",
      image: "",
      stockStatus: "in",
    })
    setShowAddProductModal(false)
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product.id)
    setEditedProduct({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description || "",
      image: product.image || "",
      stockStatus: product.stockStatus || "in",
    })
    setShowEditProductModal(true)
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault()

    // Update the product in the list
    const updatedProducts = products.map((product) =>
      product.id === editingProductId ? { ...product, ...editedProduct } : product,
    )

    setProducts(updatedProducts)

    // Reset form and close modal
    setEditingProductId(null)
    setEditedProduct({})
    setShowEditProductModal(false)
  }

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const handleSaveEdit = () => {
    const updatedProducts = products.map((product) => (product.id === editingProduct ? editedProduct : product))
    setProducts(updatedProducts)
    setEditingProduct(null)
    setEditedProduct({})
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setEditedProduct({})
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
    }
  }

  const updatePaymentStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, paymentStatus: newStatus }

        // If payment is marked as paid, add transaction details
        if (newStatus === "paid" && !order.payment.transactionId) {
          updatedOrder.payment = {
            ...updatedOrder.payment,
            transactionId: `txn_${Math.random().toString(36).substr(2, 10)}`,
            datePaid: new Date().toISOString().split("T")[0],
          }
        }

        // If payment is marked as refunded, add refund details
        if (newStatus === "refunded") {
          updatedOrder.payment = {
            ...updatedOrder.payment,
            refundId: `ref_${Math.random().toString(36).substr(2, 7)}`,
            dateRefunded: new Date().toISOString().split("T")[0],
          }
        }

        return updatedOrder
      }
      return order
    })

    setOrders(updatedOrders)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
    }
  }

  const updateShippingDetails = (orderId, carrier, trackingNumber, estimatedDelivery) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          shipping: {
            ...order.shipping,
            carrier,
            trackingNumber,
            estimatedDelivery,
          },
        }
      }
      return order
    })

    setOrders(updatedOrders)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(updatedOrders))
    }
  }

  const handleLogout = () => {
    // Clear admin data
    localStorage.removeItem("admin")
    // Redirect to admin login
    router.push("/admin/login")
  }

  // Filter orders based on status and payment status
  const statusFilteredOrders =
    filterStatus === "all" ? filteredOrders : filteredOrders.filter((order) => order.status === filterStatus)

  const paymentStatusFilteredOrders =
    filterPaymentStatus === "all"
      ? statusFilteredOrders
      : statusFilteredOrders.filter((order) => order.paymentStatus === filterPaymentStatus)

  // Sort orders
  const sortedOrders = [...paymentStatusFilteredOrders].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Generate invoice for an order
  const generateInvoice = (order) => {
    // In a real app, this would generate a PDF or HTML invoice
    alert(`Invoice generated for order ${order.id}`)

    // Create a simple text invoice for demo purposes
    const invoiceContent = `
INVOICE
==============================
Invoice #: INV-${order.id.replace("ORD-", "")}
Date: ${new Date().toISOString().split("T")[0]}
Order ID: ${order.id}
Order Date: ${order.date}

BILL TO:
${order.customer}
${order.email}
${order.shipping.address}
${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}
${order.shipping.country}

PAYMENT METHOD:
${order.payment.method}
${order.payment.cardLast4 ? `Card ending in: ${order.payment.cardLast4}` : ""}
${order.payment.transactionId ? `Transaction ID: ${order.payment.transactionId}` : ""}

ITEMS:
${order.items.map((item) => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

SUBTOTAL: $${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
SHIPPING: $${(order.total - order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}
TOTAL: $${order.total.toFixed(2)}

SHIPPING DETAILS:
${order.shipping.carrier ? `Carrier: ${order.shipping.carrier}` : "Carrier: Not assigned"}
${order.shipping.trackingNumber ? `Tracking: ${order.shipping.trackingNumber}` : "Tracking: Not available"}
SHIPPING DETAILS:
${order.shipping.carrier ? `Carrier: ${order.shipping.carrier}` : "Carrier: Not assigned"}
${order.shipping.trackingNumber ? `Tracking: ${order.shipping.trackingNumber}` : "Tracking: Not available"}
${order.shipping.estimatedDelivery ? `Est. Delivery: ${order.shipping.estimatedDelivery}` : ""}

NOTES:
${order.notes || "No notes"}

Thank you for your business!
Prana Air
==============================
`

    // Create a blob and download it
    const blob = new Blob([invoiceContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Generate packing slip for an order
  const generatePackingSlip = (order) => {
    // In a real app, this would generate a PDF or HTML packing slip
    alert(`Packing slip generated for order ${order.id}`)

    // Create a simple text packing slip for demo purposes
    const packingSlipContent = `
PACKING SLIP
==============================
Order ID: ${order.id}
Date: ${order.date}
Customer: ${order.customer}

SHIP TO:
${order.shipping.address}
${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}
${order.shipping.country}

ITEMS TO PACK:
${order.items.map((item) => `- ${item.name} x${item.quantity}`).join("\n")}

SHIPPING METHOD:
${order.shipping.carrier || "Not assigned"}
${order.shipping.trackingNumber ? `Tracking: ${order.shipping.trackingNumber}` : ""}

NOTES:
${order.notes || "No special instructions"}
==============================
`

    // Create a blob and download it
    const blob = new Blob([packingSlipContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `packing-slip-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Generate shipping label for an order
  const generateShippingLabel = (order) => {
    if (!order.shipping.carrier || !order.shipping.trackingNumber) {
      alert("Cannot generate shipping label: Missing carrier or tracking information")
      return
    }

    // In a real app, this would generate a PDF shipping label
    alert(`Shipping label generated for order ${order.id}`)

    // Create a simple text shipping label for demo purposes
    const shippingLabelContent = `
SHIPPING LABEL
==============================
Order: ${order.id}
Date: ${new Date().toISOString().split("T")[0]}

FROM:
Prana Air
123 Commerce St
Business District, CA 90210
United States

TO:
${order.customer}
${order.shipping.address}
${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}
${order.shipping.country}

CARRIER: ${order.shipping.carrier}
TRACKING: ${order.shipping.trackingNumber}
WEIGHT: 2.5 lbs

[BARCODE: ${order.shipping.trackingNumber}]
==============================
`

    // Create a blob and download it
    const blob = new Blob([shippingLabelContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `shipping-label-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Export orders to CSV
  const exportOrdersCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Email",
      "Total",
      "Status",
      "Payment Status",
      "Payment Method",
      "Shipping Carrier",
      "Tracking Number",
    ]

    const csvRows = [
      headers.join(","),
      ...sortedOrders.map((order) =>
        [
          order.id,
          order.date,
          `"${order.customer}"`, // Quotes to handle commas in names
          order.email,
          order.total.toFixed(2),
          order.status,
          order.paymentStatus,
          order.paymentMethod,
          order.shipping.carrier || "N/A",
          order.shipping.trackingNumber || "N/A",
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Calculate metrics for dashboard
  const metrics = calculateMetrics(orders)

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  return (
    <>
      {/* Header */}
      <header className="content-header bg-white rounded-lg shadow-sm mb-6 p-4 border border-gray-100">
        <div className="header-title">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "orders" && "Orders"}
            {activeTab === "products" && "Products"}
            {activeTab === "customers" && "Customers"}
            {activeTab === "analytics" && "Analytics"}
            {activeTab === "settings" && "Settings"}
          </h1>
          <p className="header-subtitle text-gray-500">
            {activeTab === "dashboard" && "Welcome back, "}
            {activeTab === "orders" && "Manage your "}
            {activeTab === "products" && "Manage your "}
            {activeTab === "customers" && "Manage your "}
            {activeTab === "analytics" && "View your "}
            {activeTab === "settings" && "Configure your "}
            {activeTab === "dashboard" ? (
              <span className="admin-name text-blue-600">{adminUser?.name || "Admin"}</span>
            ) : (
              activeTab
            )}
          </p>
        </div>

        <div className="header-actions">
          <div className="search-bar relative">
            <Search
              size={18}
              className="search-icon text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <div className="admin-profile flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="profile-avatar bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
            <div className="profile-info">
              <span className="profile-name text-gray-800">{adminUser?.name || "Admin User"}</span>
              <span className="profile-role text-gray-500">Administrator</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="content-body">
        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            {/* Stats Cards */}
            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="stat-header flex justify-between items-center mb-4">
                  <div className="stat-icon orders rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="stat-actions">
                    <span className="stat-period text-gray-400 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      This Month
                    </span>
                  </div>
                </div>
                <h3 className="stat-title text-gray-500 font-medium">Total Orders</h3>
                <div className="stat-value text-3xl font-bold text-gray-800 mb-3">{metrics.monthlyOrders}</div>
                <div className="stat-footer flex items-center gap-2">
                  <div
                    className={`stat-change flex items-center gap-1 ${metrics.orderChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {metrics.orderChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span className="font-semibold">{Math.abs(metrics.orderChange).toFixed(1)}%</span>
                  </div>
                  <span className="stat-comparison text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="stat-header flex justify-between items-center mb-4">
                  <div className="stat-icon revenue rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-200">
                    <DollarSign size={20} />
                  </div>
                  <div className="stat-actions">
                    <span className="stat-period text-gray-400 bg-gray-100 px-2 py-1 rounded-full text-xs">
                      This Month
                    </span>
                  </div>
                </div>
                <h3 className="stat-title text-gray-500 font-medium">Total Revenue</h3>
                <div className="stat-value text-3xl font-bold text-gray-800 mb-3">
                  ₹{metrics.monthlyRevenue.toFixed(2)}
                </div>
                <div className="stat-footer flex items-center gap-2">
                  <div
                    className={`stat-change flex items-center gap-1 ${metrics.revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {metrics.revenueChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    <span className="font-semibold">{Math.abs(metrics.revenueChange).toFixed(1)}%</span>
                  </div>
                  <span className="stat-comparison text-gray-400">vs last month</span>
                </div>
              </div>

              <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="stat-header flex justify-between items-center mb-4">
                  <div className="stat-icon products rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-200">
                    <Package size={20} />
                  </div>
                  <div className="stat-actions">
                    <span className="stat-period text-gray-400 bg-gray-100 px-2 py-1 rounded-full text-xs">Total</span>
                  </div>
                </div>
                <h3 className="stat-title text-gray-500 font-medium">Products</h3>
                <div className="stat-value text-3xl font-bold text-gray-800 mb-3">{products.length}</div>
                <div className="stat-footer flex items-center gap-2">
                  <div className="stat-change text-green-600 flex items-center gap-1">
                    <ArrowUp size={14} />
                    <span className="font-semibold">4.2%</span>
                  </div>
                  <span className="stat-comparison text-gray-400">new products</span>
                </div>
              </div>

              <div className="stat-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="stat-header flex justify-between items-center mb-4">
                  <div className="stat-icon customers rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-200">
                    <Users size={20} />
                  </div>
                  <div className="stat-actions">
                    <span className="stat-period text-gray-400 bg-gray-100 px-2 py-1 rounded-full text-xs">Total</span>
                  </div>
                </div>
                <h3 className="stat-title text-gray-500 font-medium">Customers</h3>
                <div className="stat-value text-3xl font-bold text-gray-800 mb-3">{customers.length}</div>
                <div className="stat-footer flex items-center gap-2">
                  <div className="stat-change text-red-600 flex items-center gap-1">
                    <ArrowDown size={14} />
                    <span className="font-semibold">2.8%</span>
                  </div>
                  <span className="stat-comparison text-gray-400">acquisition rate</span>
                </div>
              </div>
            </div>

            {/* Order Status Summary */}
            <div className="order-status-summary mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h5 className="text-lg font-bold text-gray-800">Order Status Summary</h5>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                    onClick={refreshData}
                  >
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-amber-50 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-amber-700 mb-1">{metrics.orderCounts.pending}</div>
                        <div className="text-amber-600 font-medium">Pending</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-blue-700 mb-1">{metrics.orderCounts.processing}</div>
                        <div className="text-blue-600 font-medium">Processing</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-50 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-indigo-700 mb-1">{metrics.orderCounts.shipped}</div>
                        <div className="text-indigo-600 font-medium">Shipped</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-green-50 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-green-700 mb-1">{metrics.orderCounts.completed}</div>
                        <div className="text-green-600 font-medium">Completed</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-red-50 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-red-700 mb-1">{metrics.orderCounts.cancelled}</div>
                        <div className="text-red-600 font-medium">Cancelled</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-50 opacity-50"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold text-gray-700 mb-1">{metrics.orderCounts.total}</div>
                        <div className="text-gray-600 font-medium">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Analytics Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">Sales Analytics</h2>
                  <p className="text-sm text-gray-500">
                    {productFilter !== "all"
                      ? `Showing ${
                          productFilter === "monitors"
                            ? "Air Monitors"
                            : productFilter === "purifiers"
                              ? "Air Purifiers"
                              : productFilter === "masks"
                                ? "Air Masks"
                                : "Air Sanitizers"
                        } - `
                      : ""}
                    {timeFilter === "daily"
                      ? "Daily breakdown"
                      : timeFilter === "weekly"
                        ? "Weekly breakdown"
                        : timeFilter === "monthly"
                          ? "Monthly breakdown"
                          : "Yearly breakdown"}
                    {(dateRange.start || dateRange.end) && (
                      <span className="inline-flex items-center ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                        {dateRange.start ? `From: ${new Date(dateRange.start).toLocaleDateString()}` : "Until"}
                        {dateRange.start && dateRange.end ? " → " : ""}
                        {dateRange.end
                          ? `${!dateRange.start ? "" : "To: "}${new Date(dateRange.end).toLocaleDateString()}`
                          : ""}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Date Range:</span>
                    <input
                      type="date"
                      className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
                      value={dateRange.start}
                      max={dateRange.end || undefined}
                      aria-label="Start date"
                      onChange={(e) => {
                        const newStart = e.target.value
                        setDateRange((prev) => {
                          // Validate date range
                          if (prev.end && new Date(newStart) > new Date(prev.end)) {
                            // If start date is after end date, adjust end date
                            return { start: newStart, end: newStart }
                          }
                          return { ...prev, start: newStart }
                        })
                        // Apply filters immediately
                        applyDateFilter(e.target.value, dateRange.end)
                        setCurrentPage(1)
                      }}
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <input
                      type="date"
                      className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
                      value={dateRange.end}
                      min={dateRange.start || undefined}
                      aria-label="End date"
                      onChange={(e) => {
                        const newEnd = e.target.value
                        setDateRange((prev) => {
                          // Validate date range
                          if (prev.start && new Date(newEnd) < new Date(prev.start)) {
                            // If end date is before start date, adjust start date
                            return { start: newEnd, end: newEnd }
                          }
                          return { ...prev, end: newEnd }
                        })
                        // Apply filters immediately
                        applyDateFilter(dateRange.start, e.target.value)
                        setCurrentPage(1)
                      }}
                    />
                    <button
                      className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md transition-colors whitespace-nowrap"
                      onClick={() => {
                        setDateRange({ start: "", end: "" })
                        applyDateFilter("", "")
                        setCurrentPage(1)
                      }}
                      aria-label="Reset date filter"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Product Filter */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-sm text-gray-500">Product:</span>
                    <select
                      className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white"
                      value={productFilter}
                      onChange={(e) => {
                        setProductFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      aria-label="Filter by product category"
                    >
                      <option value="all">All Products</option>
                      <option value="monitors">Air Monitors</option>
                      <option value="purifiers">Air Purifiers</option>
                      <option value="masks">Air Masks</option>
                      <option value="sanitizers">Air Sanitizers</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === "daily" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                      onClick={() => setTimeFilter("daily")}
                      aria-pressed={timeFilter === "daily"}
                      aria-label="Show daily data"
                    >
                      Daily
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === "weekly" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                      onClick={() => setTimeFilter("weekly")}
                      aria-pressed={timeFilter === "weekly"}
                      aria-label="Show weekly data"
                    >
                      Weekly
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === "monthly" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                      onClick={() => setTimeFilter("monthly")}
                      aria-pressed={timeFilter === "monthly"}
                      aria-label="Show monthly data"
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeFilter === "yearly" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                      onClick={() => setTimeFilter("yearly")}
                      aria-pressed={timeFilter === "yearly"}
                      aria-label="Show yearly data"
                    >
                      Yearly
                    </button>
                  </div>

                  {/* Chart Type Selector */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      className={`p-1.5 rounded-md ${chartType === "bar" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                      onClick={() => setChartType("bar")}
                      title="Bar Chart"
                      aria-pressed={chartType === "bar"}
                      aria-label="Show bar chart"
                    >
                      <BarChart2 size={18} />
                    </button>
                    <button
                      className={`p-1.5 rounded-md ${chartType === "line" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
                      onClick={() => setChartType("line")}
                      title="Line Chart"
                      aria-pressed={chartType === "line"}
                      aria-label="Show line chart"
                    >
                      <LineChart size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Sample Sales Data - In a real app, this would come from your API */}
                {(() => {
                  // Generate sample data based on the selected time filter
                  const salesData = [
                    {
                      name:
                        timeFilter === "daily"
                          ? "Mon"
                          : timeFilter === "weekly"
                            ? "Week 1"
                            : timeFilter === "monthly"
                              ? "Jan"
                              : "2020",
                      sales: 4000,
                      revenue: 240000,
                      category: "All Products",
                    },
                    {
                      name:
                        timeFilter === "daily"
                          ? "Tue"
                          : timeFilter === "weekly"
                            ? "Week 2"
                            : timeFilter === "monthly"
                              ? "Feb"
                              : "2021",
                      sales: 3000,
                      revenue: 198000,
                      category: "All Products",
                    },
                    {
                      name:
                        timeFilter === "daily"
                          ? "Wed"
                          : timeFilter === "weekly"
                            ? "Week 3"
                            : timeFilter === "monthly"
                              ? "Mar"
                              : "2022",
                      sales: 2000,
                      revenue: 120000,
                      category: "All Products",
                    },
                    {
                      name:
                        timeFilter === "daily"
                          ? "Thu"
                          : timeFilter === "weekly"
                            ? "Week 4"
                            : timeFilter === "monthly"
                              ? "Apr"
                              : "2023",
                      sales: 2780,
                      revenue: 167800,
                      category: "All Products",
                    },
                    {
                      name:
                        timeFilter === "daily"
                          ? "Fri"
                          : timeFilter === "weekly"
                            ? "Week 5"
                            : timeFilter === "monthly"
                              ? "May"
                              : "2024",
                      sales: 1890,
                      revenue: 113400,
                      category: "All Products",
                    },
                    {
                      name:
                        timeFilter === "daily"
                          ? "Sat"
                          : timeFilter === "weekly"
                            ? "Week 6"
                            : timeFilter === "monthly"
                              ? "Jun"
                              : "2025",
                      sales: 2390,
                      revenue: 143400,
                      category: "All Products",
                    },
                    {
                      name:
                        timeFilter === "daily"
                          ? "Sun"
                          : timeFilter === "weekly"
                            ? "Week 7"
                            : timeFilter === "monthly"
                              ? "Jul"
                              : "2026",
                      sales: 3490,
                      revenue: 209400,
                      category: "All Products",
                    },
                  ]

                  if (timeFilter === "monthly") {
                    salesData.push(
                      { name: "Aug", sales: 2490, revenue: 149400, category: "All Products" },
                      { name: "Sep", sales: 2290, revenue: 137400, category: "All Products" },
                      { name: "Oct", sales: 3490, revenue: 209400, category: "All Products" },
                      { name: "Nov", sales: 4490, revenue: 269400, category: "All Products" },
                      { name: "Dec", sales: 5490, revenue: 329400, category: "All Products" },
                    )
                  }

                  // Filter data based on product filter (simulated filtering)
                  const categoryLabel =
                    productFilter === "all"
                      ? "All Products"
                      : productFilter === "monitors"
                        ? "Air Monitors"
                        : productFilter === "purifiers"
                          ? "Air Purifiers"
                          : productFilter === "masks"
                            ? "Air Masks"
                            : "Air Sanitizers"

                  const filteredData =
                    productFilter === "all"
                      ? salesData
                      : salesData.map((item) => {
                          const multiplier =
                            productFilter === "monitors"
                              ? 0.4
                              : productFilter === "purifiers"
                                ? 0.3
                                : productFilter === "masks"
                                  ? 0.2
                                  : 0.1

                          return {
                            ...item,
                            sales: Math.round(item.sales * multiplier),
                            revenue: Math.round(item.revenue * multiplier),
                            category: categoryLabel,
                          }
                        })

                  // Apply date range filter if set
                  const dateFilteredData = filteredData.filter((item, index) => {
                    if (!dateRange.start && !dateRange.end) return true

                    // For demo purposes, we'll create a more consistent filtering mechanism
                    // In a real app, you would filter based on actual dates

                    // Generate a deterministic filter based on the date range and item properties
                    const dateFilterSeed = (dateRange.start + dateRange.end)
                      .split("")
                      .reduce((acc, char) => acc + char.charCodeAt(0), 0)

                    // Use the name of the item as part of the filter to make it consistent
                    const nameSeed = item.name.charCodeAt(0) || 0

                    // Create a deterministic filter value between 0-99
                    const filterValue = (index + dateFilterSeed + nameSeed) % 100

                    // Filter based on date range
                    if (dateRange.start && dateRange.end) {
                      // Both dates set - stricter filter (keep ~70% of items)
                      return filterValue < 70
                    } else if (dateRange.start) {
                      // Only start date - keep ~80% of items
                      return filterValue < 80
                    } else {
                      // Only end date - keep ~90% of items
                      return filterValue < 90
                    }
                  })

                  // Custom tooltip formatter
                  const customTooltipFormatter = (value, name) => {
                    if (name === "revenue") {
                      return [`₹${value.toLocaleString()}`, "Revenue"]
                    }
                    return [value.toLocaleString(), "Units Sold"]
                  }

                  return (
                    <div className="w-full h-[500px] -mx-5 -mb-5">
                      <ChartContainer
                        config={{
                          sales: {
                            label: "Units Sold",
                            color: "hsl(215, 100%, 50%)",
                          },
                          revenue: {
                            label: "Revenue (₹)",
                            color: "hsl(142, 76%, 36%)",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          {chartType === "bar" ? (
                            <BarChart data={dateFilteredData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                label={{
                                  value:
                                    timeFilter === "daily"
                                      ? "Day"
                                      : timeFilter === "weekly"
                                        ? "Week"
                                        : timeFilter === "monthly"
                                          ? "Month"
                                          : "Year",
                                  position: "insideBottom",
                                  offset: -15,
                                }}
                              />
                              <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="hsl(215, 100%, 50%)"
                                label={{ value: "Units Sold", angle: -90, position: "insideLeft" }}
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="hsl(142, 76%, 36%)"
                                label={{ value: "Revenue (₹)", angle: 90, position: "insideRight" }}
                              />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                formatter={customTooltipFormatter}
                                labelFormatter={(label) => `${label} (${categoryLabel})`}
                              />
                              <Legend wrapperStyle={{ bottom: 0 }} />
                              <Bar
                                yAxisId="left"
                                dataKey="sales"
                                name="Units Sold"
                                fill="var(--color-sales)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={60}
                                label={{
                                  position: "top",
                                  formatter: (value) => (value > 3000 ? value.toLocaleString() : ""),
                                  fill: "hsl(215, 100%, 50%)",
                                  fontSize: 10,
                                }}
                              />
                              <Bar
                                yAxisId="right"
                                dataKey="revenue"
                                name="Revenue (₹)"
                                fill="var(--color-revenue)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={60}
                                label={{
                                  position: "top",
                                  formatter: (value) => (value > 200000 ? `₹${(value / 1000).toFixed(0)}K` : ""),
                                  fill: "hsl(142, 76%, 36%)",
                                  fontSize: 10,
                                }}
                              />
                            </BarChart>
                          ) : (
                            <RechartsLineChart
                              data={dateFilteredData}
                              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                label={{
                                  value:
                                    timeFilter === "daily"
                                      ? "Day"
                                      : timeFilter === "weekly"
                                        ? "Week"
                                        : timeFilter === "monthly"
                                          ? "Month"
                                          : "Year",
                                  position: "insideBottom",
                                  offset: -15,
                                }}
                              />
                              <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="hsl(215, 100%, 50%)"
                                label={{ value: "Units Sold", angle: -90, position: "insideLeft" }}
                              />
                              <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="hsl(142, 76%, 36%)"
                                label={{ value: "Revenue (₹)", angle: 90, position: "insideRight" }}
                              />
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                                formatter={customTooltipFormatter}
                                labelFormatter={(label) => `${label} (${categoryLabel})`}
                              />
                              <Legend wrapperStyle={{ bottom: 0 }} />
                              <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="sales"
                                name="Units Sold"
                                stroke="var(--color-sales)"
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                                dot={{ stroke: "var(--color-sales)", strokeWidth: 2, r: 4 }}
                                label={{
                                  position: "top",
                                  formatter: (value) => (value > 3000 ? value.toLocaleString() : ""),
                                  fill: "hsl(215, 100%, 50%)",
                                  fontSize: 10,
                                  offset: 10,
                                }}
                              />
                              <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="revenue"
                                name="Revenue (₹)"
                                stroke="var(--color-revenue)"
                                strokeWidth={2}
                                dot={{ stroke: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                                label={{
                                  position: "top",
                                  formatter: (value) => (value > 200000 ? `₹${(value / 1000).toFixed(0)}K` : ""),
                                  fill: "hsl(142, 76%, 36%)",
                                  fontSize: 10,
                                  offset: 10,
                                }}
                              />
                            </RechartsLineChart>
                          )}
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Top Selling Products Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
                  <div className="flex items-center gap-2">
                    <select
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                      value={productFilter}
                      onChange={(e) => setProductFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="monitors">Air Monitors</option>
                      <option value="purifiers">Air Purifiers</option>
                      <option value="masks">Air Masks</option>
                      <option value="sanitizers">Air Sanitizers</option>
                    </select>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-4">
                    {products
                      .filter(
                        (product) =>
                          productFilter === "all" ||
                          (productFilter === "monitors" && product.name.includes("Monitor")) ||
                          (productFilter === "purifiers" && product.name.includes("Purifier")) ||
                          (productFilter === "masks" && product.name.includes("Mask")) ||
                          (productFilter === "sanitizers" && product.name.includes("Sanitizer")),
                      )
                      .sort((a, b) => b.stock - a.stock) // Sort by stock as a proxy for popularity
                      .slice(0, 5)
                      .map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg mr-4">
                            <span className="font-bold text-gray-700">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-800">₹{product.price.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">{product.stock} in stock</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">Sales by Product Category</h2>
                </div>

                <div className="p-5">
                  {/* Sample Category Data - In a real app, this would come from your API */}
                  {(() => {
                    const categoryData = [
                      { name: "Air Monitors", value: 35 },
                      { name: "Air Purifiers", value: 25 },
                      { name: "Air Masks", value: 20 },
                      { name: "Air Sanitizers", value: 15 },
                      { name: "Fresh Air Machines", value: 5 },
                    ]

                    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

                    return (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Sales Percentage"]} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                  onClick={() => router.push("/admin/orders")}
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{order.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                          ₹{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${order.status === "pending" ? "bg-amber-100 text-amber-800" : ""}
                  ${order.status === "processing" ? "bg-blue-100 text-blue-800" : ""}
                  ${order.status === "shipped" ? "bg-indigo-100 text-indigo-800" : ""}
                  ${order.status === "completed" ? "bg-green-100 text-green-800" : ""}
                  ${order.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
                `}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${order.paymentStatus === "pending" ? "bg-amber-100 text-amber-800" : ""}
                  ${order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : ""}
                  ${order.paymentStatus === "refunded" ? "bg-purple-100 text-purple-800" : ""}
                  ${order.paymentStatus === "failed" ? "bg-red-100 text-red-800" : ""}
                `}
                          >
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                              onClick={() => {
                                window.location.href = `/admin/orders/${order.id}`
                              }}
                            >
                              <ExternalLink size={16} />
                            </button>
                            <div className="relative">
                              <button className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200">
                                <ChevronDown size={16} />
                              </button>
                              <div className="dropdown-menu">
                                <button onClick={() => updateOrderStatus(order.id, "pending")}>Set as Pending</button>
                                <button onClick={() => updateOrderStatus(order.id, "processing")}>
                                  Set as Processing
                                </button>
                                <button onClick={() => updateOrderStatus(order.id, "shipped")}>Set as Shipped</button>
                                <button onClick={() => updateOrderStatus(order.id, "completed")}>
                                  Set as Completed
                                </button>
                                <button onClick={() => updateOrderStatus(order.id, "cancelled")}>
                                  Set as Cancelled
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Keep the rest of the tabs as they are */}
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="orders-content">
            {/* Keep the existing orders tab content */}
            <div className="page-actions">
              <div className="filters">
                <div className="filter-item">
                  <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value)
                      setCurrentPage(1) // Reset to first page when filter changes
                    }}
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="filter-item">
                  <select
                    className="filter-select"
                    value={filterPaymentStatus}
                    onChange={(e) => {
                      setFilterPaymentStatus(e.target.value)
                      setCurrentPage(1) // Reset to first page when filter changes
                    }}
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="filter-item">
                  <select
                    className="filter-select"
                    value={sortOrder}
                    onChange={(e) => {
                      setSortOrder(e.target.value)
                      setCurrentPage(1) // Reset to first page when sort changes
                    }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                <div className="filter-item">
                  <select
                    className="filter-select"
                    onChange={(e) => {
                      const value = e.target.value
                      const today = new Date()
                      let startDate = ""

                      if (value === "7days") {
                        const sevenDaysAgo = new Date(today)
                        sevenDaysAgo.setDate(today.getDate() - 7)
                        startDate = sevenDaysAgo.toISOString().split("T")[0]
                      } else if (value === "30days") {
                        const thirtyDaysAgo = new Date(today)
                        thirtyDaysAgo.setDate(today.getDate() - 30)
                        startDate = thirtyDaysAgo.toISOString().split("T")[0]
                      }

                      setDateRange({ ...dateRange, start: startDate })
                      setCurrentPage(1) // Reset to first page when filter changes
                    }}
                  >
                    <option value="all">All Time</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                  </select>
                </div>

                <div className="filter-item date-range">
                  <input
                    type="date"
                    className="date-input"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    placeholder="Start Date"
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    className="date-input"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    placeholder="End Date"
                  />
                  {(dateRange.start || dateRange.end) && (
                    <button className="clear-dates-btn" onClick={() => setDateRange({ start: "", end: "" })}>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="export-actions">
                <button className="action-button" onClick={exportOrdersCSV}>
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
                <button className="action-button" onClick={refreshData}>
                  <RefreshCw size={14} className={refreshing ? "spin" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="data-card">
              <div className="card-content scrollable">
                <table className="data-table orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Shipping</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="order-row"
                        onClick={() => {
                          window.location.href = `/admin/orders/${order.id}`
                        }}
                      >
                        <td className="order-id">{order.id}</td>
                        <td>{order.customer}</td>
                        <td>
                          <div className="table-date">
                            <Calendar size={14} />
                            <span>{order.date}</span>
                          </div>
                        </td>
                        <td className="amount">₹{order.total.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`payment-badge ${order.paymentStatus}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td>
                          {order.shipping.trackingNumber ? (
                            <div className="tracking-info">
                              <span className="carrier">{order.shipping.carrier}</span>
                              <span className="tracking-number">
                                {order.shipping.trackingNumber.substring(0, 10)}...
                              </span>
                            </div>
                          ) : (
                            <span className="no-tracking">Not shipped</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-button primary"
                              onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                window.location.href = `/admin/orders/${order.id}`
                              }}
                            >
                              <ExternalLink size={14} />
                              <span>View</span>
                            </button>
                            <div className="dropdown">
                              <button
                                className="action-button"
                                onClick={(e) => e.stopPropagation()} // Prevent row click
                              >
                                <span>Status</span>
                                <ChevronDown size={14} />
                              </button>
                              <div className="dropdown-menu">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updateOrderStatus(order.id, "pending")
                                  }}
                                >
                                  Set as Pending
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updateOrderStatus(order.id, "processing")
                                  }}
                                >
                                  Set as Processing
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updateOrderStatus(order.id, "shipped")
                                  }}
                                >
                                  Set as Shipped
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updateOrderStatus(order.id, "completed")
                                  }}
                                >
                                  Set as Completed
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updateOrderStatus(order.id, "cancelled")
                                  }}
                                >
                                  Set as Cancelled
                                </button>
                              </div>
                            </div>
                            <div className="dropdown">
                              <button
                                className="action-button"
                                onClick={(e) => e.stopPropagation()} // Prevent row click
                              >
                                <span>Payment</span>
                                <ChevronDown size={14} />
                              </button>
                              <div className="dropdown-menu">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updatePaymentStatus(order.id, "pending")
                                  }}
                                >
                                  Mark as Pending
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updatePaymentStatus(order.id, "paid")
                                  }}
                                >
                                  Mark as Paid
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updatePaymentStatus(order.id, "refunded")
                                  }}
                                >
                                  Mark as Refunded
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    updatePaymentStatus(order.id, "failed")
                                  }}
                                >
                                  Mark as Failed
                                </button>
                              </div>
                            </div>
                            <div className="dropdown">
                              <button
                                className="action-button"
                                onClick={(e) => e.stopPropagation()} // Prevent row click
                              >
                                <span>Documents</span>
                                <ChevronDown size={14} />
                              </button>
                              <div className="dropdown-menu">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    generateInvoice(order)
                                  }}
                                >
                                  Download Invoice
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    generatePackingSlip(order)
                                  }}
                                >
                                  Download Packing Slip
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent row click
                                    generateShippingLabel(order)
                                  }}
                                >
                                  Download Shipping Label
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="products-content">
            {/* Keep the existing products tab content */}
            <div className="page-actions">
              <div className="filters">
                <div className="filter-item">
                  <select
                    className="filter-select"
                    onChange={(e) => {
                      // Reset to first page when filter changes
                      setCurrentProductPage(1)
                    }}
                  >
                    <option value="all">All Stock Status</option>
                    <option value="instock">In Stock</option>
                    <option value="lowstock">Low Stock</option>
                    <option value="outofstock">Out of Stock</option>
                  </select>
                </div>

                <div className="filter-item">
                  <select
                    className="filter-select"
                    value={productCategoryFilter}
                    onChange={(e) => {
                      setProductCategoryFilter(e.target.value)
                      setCurrentProductPage(1) // Reset to first page when filter changes
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="Air Monitors">Air Monitors</option>
                    <option value="Air Purifiers">Air Purifiers</option>
                    <option value="Air Masks">Air Masks</option>
                    <option value="Air Sanitizers">Air Sanitizers</option>
                    <option value="Fresh Air Machines">Fresh Air Machines</option>
                  </select>
                </div>
              </div>

              <div className="action-buttons">
                <button className="primary-button" onClick={() => setShowAddProductModal(true)}>
                  <Plus size={16} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="data-card">
              <div className="card-content">
                <table className="data-table products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="product-image">
                          <img src={product.image || "/placeholder.svg"} alt={product.name} />
                        </td>
                        <td>
                          {editingProduct === product.id ? (
                            <input
                              type="text"
                              value={editedProduct.name}
                              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                              className="edit-input"
                            />
                          ) : (
                            product.name
                          )}
                        </td>
                        <td className="sku">
                          {editingProduct === product.id ? (
                            <input
                              type="text"
                              value={editedProduct.sku}
                              onChange={(e) => setEditedProduct({ ...editedProduct, sku: e.target.value })}
                              className="edit-input"
                            />
                          ) : (
                            product.sku
                          )}
                        </td>
                        <td>
                          {editingProduct === product.id ? (
                            <select
                              value={editedProduct.category || ""}
                              onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                              className="edit-input"
                            >
                              <option value="Air Monitors">Air Monitors</option>
                              <option value="Air Purifiers">Air Purifiers</option>
                              <option value="Air Masks">Air Masks</option>
                              <option value="Air Sanitizers">Air Sanitizers</option>
                              <option value="Fresh Air Machines">Fresh Air Machines</option>
                            </select>
                          ) : (
                            product.category
                          )}
                        </td>
                        <td className="amount">
                          {editingProduct === product.id ? (
                            <input
                              type="number"
                              value={editedProduct.price}
                              onChange={(e) =>
                                setEditedProduct({ ...editedProduct, price: Number.parseFloat(e.target.value) })
                              }
                              className="edit-input"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            `₹${product.price.toFixed(2)}`
                          )}
                        </td>
                        <td>
                          {editingProduct === product.id ? (
                            <input
                              type="number"
                              value={editedProduct.stock}
                              onChange={(e) =>
                                setEditedProduct({ ...editedProduct, stock: Number.parseInt(e.target.value) })
                              }
                              className="edit-input"
                              min="0"
                            />
                          ) : (
                            <span className={`stock-badge ${product.stock <= 10 ? "low" : "in"}`}>
                              {product.stock} in stock
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            {editingProduct === product.id ? (
                              <>
                                <button className="action-button" onClick={handleSaveEdit}>
                                  <span>Save</span>
                                </button>
                                <button className="action-button" onClick={handleCancelEdit}>
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="action-button" onClick={() => handleEditProduct(product)}>
                                  <Edit size={14} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  className="action-button danger"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 size={14} />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Products Pagination */}
              {totalProductPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={currentProductPage === 1}
                    onClick={() => paginateProducts(currentProductPage - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalProductPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-button ${currentProductPage === i + 1 ? "active" : ""}`}
                      onClick={() => paginateProducts(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="pagination-button"
                    disabled={currentProductPage === totalProductPages}
                    onClick={() => paginateProducts(currentProductPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Add Product Modal */}
            {showAddProductModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2>Add New Product</h2>
                    <button className="close-button" onClick={() => setShowAddProductModal(false)}>
                      &times;
                    </button>
                  </div>

                  <div className="modal-body">
                    <form onSubmit={handleAddProduct}>
                      <div className="form-group">
                        <label htmlFor="productName">Product Name</label>
                        <input
                          type="text"
                          id="productName"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="productSku">SKU</label>
                        <input
                          type="text"
                          id="productSku"
                          value={newProduct.sku}
                          onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="productPrice">Price (₹)</label>
                          <input
                            type="number"
                            id="productPrice"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="productStock">Stock</label>
                          <input
                            type="number"
                            id="productStock"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            required
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="productImage">Product Image</label>
                        <input
                          type="file"
                          id="productImage"
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0]?.name || "" })}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="productStockStatus">Stock Status</label>
                        <select
                          id="productStockStatus"
                          value={newProduct.stockStatus}
                          onChange={(e) => setNewProduct({ ...newProduct, stockStatus: e.target.value })}
                        >
                          <option value="in">In Stock</option>
                          <option value="out">Out of Stock</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="productDescription">Description</label>
                        <textarea
                          id="productDescription"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          rows="4"
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="productCategory">Category</label>
                        <select
                          id="productCategory"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        >
                          <option value="Air Monitors">Air Monitors</option>
                          <option value="Air Purifiers">Air Purifiers</option>
                          <option value="Air Masks">Air Masks</option>
                          <option value="Air Sanitizers">Air Sanitizers</option>
                          <option value="Fresh Air Machines">Fresh Air Machines</option>
                        </select>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => setShowAddProductModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="button-primary">
                          Add Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Product Modal */}
            {showEditProductModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2>Edit Product</h2>
                    <button className="close-button" onClick={() => setShowEditProductModal(false)}>
                      &times;
                    </button>
                  </div>

                  <div className="modal-body">
                    <form onSubmit={handleUpdateProduct}>
                      <div className="form-group">
                        <label htmlFor="editProductName">Product Name</label>
                        <input
                          type="text"
                          id="editProductName"
                          value={editedProduct.name || ""}
                          onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="editProductSku">SKU</label>
                        <input
                          type="text"
                          id="editProductSku"
                          value={editedProduct.sku || ""}
                          onChange={(e) => setEditedProduct({ ...editedProduct, sku: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="editProductPrice">Price (₹)</label>
                          <input
                            type="number"
                            id="editProductPrice"
                            value={editedProduct.price || ""}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, price: Number.parseFloat(e.target.value) })
                            }
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="editProductStock">Stock</label>
                          <input
                            type="number"
                            id="editProductStock"
                            value={editedProduct.stock || ""}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, stock: Number.parseInt(e.target.value) })
                            }
                            required
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="editProductImage">Product Image</label>
                        <input
                          type="file"
                          id="editProductImage"
                          onChange={(e) =>
                            setEditedProduct({
                              ...editedProduct,
                              image: e.target.files[0]?.name || editedProduct.image,
                            })
                          }
                        />
                        {editedProduct.image && (
                          <div className="image-preview">
                            <img
                              src={
                                editedProduct.image.startsWith("/")
                                  ? editedProduct.image
                                  : `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(editedProduct.name)}`
                              }
                              alt={editedProduct.name}
                              style={{ maxHeight: "100px", marginTop: "10px" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="editProductStockStatus">Stock Status</label>
                        <select
                          id="editProductStockStatus"
                          value={editedProduct.stockStatus || "in"}
                          onChange={(e) => setEditedProduct({ ...editedProduct, stockStatus: e.target.value })}
                        >
                          <option value="in">In Stock</option>
                          <option value="out">Out of Stock</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="editProductDescription">Description</label>
                        <textarea
                          id="editProductDescription"
                          value={editedProduct.description || ""}
                          onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                          rows="4"
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="editProductCategory">Category</label>
                        <select
                          id="editProductCategory"
                          value={editedProduct.category || ""}
                          onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                        >
                          <option value="Air Monitors">Air Monitors</option>
                          <option value="Air Purifiers">Air Purifiers</option>
                          <option value="Air Masks">Air Masks</option>
                          <option value="Air Sanitizers">Air Sanitizers</option>
                          <option value="Fresh Air Machines">Fresh Air Machines</option>
                        </select>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="button-secondary"
                          onClick={() => setShowEditProductModal(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="button-primary">
                          Update Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="customers-content">
            {/* Keep the existing customers tab content */}
            <div className="page-actions">
              <div className="filters">
                <div className="filter-item">
                  <select className="filter-select">
                    <option value="all">All Customers</option>
                    <option value="new">New Customers</option>
                    <option value="returning">Returning Customers</option>
                  </select>
                </div>
              </div>

              <div className="export-actions">
                <button className="action-button">Export CSV</button>
              </div>
            </div>

            <div className="data-card">
              <div className="card-content scrollable">
                <table className="data-table customers-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Products Bought</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>#{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>
                          <div className="table-email">
                            <Mail size={14} />
                            <span>{customer.email}</span>
                          </div>
                        </td>
                        <td>{customer.phone}</td>
                        <td className="address-cell">{customer.address}</td>
                        <td>{customer.orders}</td>
                        <td className="amount">₹{customer.spent.toFixed(2)}</td>
                        <td className="products-cell">{customer.productsBought.join(", ")}</td>
                        <td>
                          <div className="table-actions">
                            <button className="action-button primary">
                              <ExternalLink size={14} />
                              <span>View</span>
                            </button>
                            <button className="action-button">
                              <Mail size={14} />
                              <span>Email</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Customers Pagination */}
              {totalCustomerPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    disabled={currentCustomerPage === 1}
                    onClick={() => paginateCustomers(currentCustomerPage - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalCustomerPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-button ${currentCustomerPage === i + 1 ? "active" : ""}`}
                      onClick={() => paginateCustomers(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    className="pagination-button"
                    disabled={currentCustomerPage === totalCustomerPages}
                    onClick={() => paginateCustomers(currentCustomerPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="analytics-content">
            {/* Keep the existing analytics tab content */}
            <div className="analytics-header">
              <div className="period-selector">
                <button className="period-button active">Last 7 days</button>
                <button className="period-button">Last 30 days</button>
                <button className="period-button">Last 90 days</button>
                <button className="period-button">Custom</button>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card sales-analytics">
                <div className="card-header">
                  <h2 className="card-title">Sales Analytics</h2>
                </div>

                <div className="card-content">
                  <div className="chart-placeholder">
                    <div className="chart-empty">
                      <BarChartIcon size={48} />
                      <p>Sales analytics visualization would appear here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card top-products">
                <div className="card-header">
                  <h2 className="card-title">Top Selling Products</h2>
                </div>

                <div className="card-content">
                  <div className="product-rank-list">
                    {products.slice(0, 5).map((product, index) => (
                      <div className="product-rank-item" key={product.id}>
                        <div className="rank">{index + 1}</div>
                        <div className="product-image">
                          <img src={product.image || "/placeholder.svg"} alt={product.name} />
                        </div>
                        <div className="product-details">
                          <h4>{product.name}</h4>
                          <p className="amount">₹{product.price.toFixed(2)}</p>
                        </div>
                        <div className="product-sales">
                          <div className="sales-bar" style={{ width: `${100 - index * 15}%` }}></div>
                          <span>{100 - index * 15} sold</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="analytics-grid second-row">
              <div className="analytics-card customer-analytics">
                <div className="card-header">
                  <h2 className="card-title">Customer Demographics</h2>
                </div>

                <div className="card-content">
                  <div className="chart-placeholder">
                    <div className="chart-empty">
                      <Users size={48} />
                      <p>Customer demographics visualization would appear here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card inventory-analytics">
                <div className="card-header">
                  <h2 className="card-title">Inventory Status</h2>
                </div>

                <div className="card-content">
                  <div className="chart-placeholder">
                    <div className="chart-empty">
                      <Package size={48} />
                      <p>Inventory status visualization would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="settings-content">
            {/* Keep the existing settings tab content */}
            <div className="settings-grid">
              <div className="settings-card">
                <div className="card-header">
                  <h2 className="card-title">General Settings</h2>
                </div>

                <div className="card-content">
                  <form className="settings-form">
                    <div className="form-group">
                      <label htmlFor="storeName">Store Name</label>
                      <input type="text" id="storeName" defaultValue="Prana Air" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="storeEmail">Store Email</label>
                      <input type="email" id="storeEmail" defaultValue="contact@pranaair.com" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="storePhone">Store Phone</label>
                      <input type="tel" id="storePhone" defaultValue="+91 123 456 7890" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="storeCurrency">Currency</label>
                      <select id="storeCurrency" defaultValue="INR">
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="button-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="settings-card">
                <div className="card-header">
                  <h2 className="card-title">User Account</h2>
                </div>

                <div className="card-content">
                  <form className="settings-form">
                    <div className="form-group">
                      <label htmlFor="adminName">Name</label>
                      <input type="text" id="adminName" defaultValue={adminUser?.name || "Admin User"} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="adminEmail">Email</label>
                      <input type="email" id="adminEmail" defaultValue={adminUser?.email || "admin@pranaair.com"} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="adminPassword">Password</label>
                      <input type="password" id="adminPassword" placeholder="••••••••" />
                      <span className="form-hint">Leave blank to keep current password</span>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="button-primary">
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="settings-card notifications">
              <div className="card-header">
                <h2 className="card-title">Notification Settings</h2>
              </div>

              <div className="card-content">
                <div className="notification-options">
                  <div className="notification-option">
                    <div className="option-details">
                      <h3>New Order Notifications</h3>
                      <p>Receive notifications when new orders are placed</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultValue="checked" />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <div className="notification-option">
                    <div className="option-details">
                      <h3>Low Stock Alerts</h3>
                      <p>Get notified when product inventory is running low</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultValue="checked" />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <div className="notification-option">
                    <div className="option-details">
                      <h3>Customer Sign-ups</h3>
                      <p>Notifications for new customer registrations</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>

                  <div className="notification-option">
                    <div className="option-details">
                      <h3>Payment Notifications</h3>
                      <p>Get notified about payment status updates</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultValue="checked" />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="button-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

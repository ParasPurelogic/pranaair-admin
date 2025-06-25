"use client"

import { useState, useEffect } from "react"
import {
  ShoppingBag,
  Search,
  Calendar,
  Download,
  RefreshCw,
  ExternalLink,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Types
interface Order {
  id: string
  customer: string
  email: string
  date: string
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
  }>
  shipping: {
    address: string
    city: string
    state: string
    zip: string
    country: string
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
  }
  payment: {
    method: string
    cardLast4?: string
    transactionId?: string
    datePaid?: string
    refundId?: string
    dateRefunded?: string
  }
  notes: string
}

// Generate 200 mock orders
const generateMockOrders = (): Order[] => {
  const statuses = ["pending", "processing", "shipped", "completed", "cancelled"]
  const paymentStatuses = ["pending", "paid", "refunded", "failed"]
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Apple Pay", "Google Pay"]
  const carriers = ["FedEx", "UPS", "USPS", "DHL", "Amazon Logistics"]
  const products = [
    { id: 1, name: "Air Quality Monitor", price: 149.99 },
    { id: 2, name: "Wearable Air Purifier", price: 99.99 },
    { id: 3, name: "Air Mask", price: 29.99 },
    { id: 4, name: "Air Sanitizer", price: 49.99 },
    { id: 5, name: "Fresh Air Machine", price: 299.99 },
    { id: 6, name: "HEPA Filter", price: 39.99 },
    { id: 7, name: "Replacement Filters", price: 19.99 },
    { id: 8, name: "Air Quality Sensor", price: 89.99 },
    { id: 9, name: "Portable Air Purifier", price: 129.99 },
    { id: 10, name: "Smart Air Monitor", price: 199.99 },
  ]
  const cities = [
    { city: "New York", state: "NY", zip: "10001" },
    { city: "Los Angeles", state: "CA", zip: "90001" },
    { city: "Chicago", state: "IL", zip: "60601" },
    { city: "Houston", state: "TX", zip: "77001" },
    { city: "Phoenix", state: "AZ", zip: "85001" },
    { city: "Philadelphia", state: "PA", zip: "19102" },
    { city: "San Antonio", state: "TX", zip: "78201" },
    { city: "San Diego", state: "CA", zip: "92101" },
    { city: "Dallas", state: "TX", zip: "75201" },
    { city: "San Jose", state: "CA", zip: "95101" },
    { city: "Austin", state: "TX", zip: "78701" },
    { city: "Jacksonville", state: "FL", zip: "32099" },
    { city: "Fort Worth", state: "TX", zip: "76101" },
    { city: "Columbus", state: "OH", zip: "43085" },
    { city: "San Francisco", state: "CA", zip: "94101" },
    { city: "Charlotte", state: "NC", zip: "28201" },
    { city: "Indianapolis", state: "IN", zip: "46201" },
    { city: "Seattle", state: "WA", zip: "98101" },
    { city: "Denver", state: "CO", zip: "80201" },
    { city: "Boston", state: "MA", zip: "02108" },
  ]
  const streets = [
    "Main St",
    "Oak Ave",
    "Maple Rd",
    "Cedar Ln",
    "Pine Dr",
    "Elm St",
    "Washington Ave",
    "Park Rd",
    "Lake Dr",
    "River Rd",
    "Highland Ave",
    "Valley Rd",
    "Mountain Dr",
    "Sunset Blvd",
    "Sunrise Ave",
    "Forest Dr",
    "Meadow Ln",
    "Brook Rd",
    "Creek Dr",
    "Hill St",
  ]
  const firstNames = [
    "John",
    "Jane",
    "Robert",
    "Emily",
    "Michael",
    "Sarah",
    "David",
    "Jennifer",
    "Thomas",
    "Lisa",
    "James",
    "Mary",
    "William",
    "Patricia",
    "Richard",
    "Linda",
    "Charles",
    "Barbara",
    "Joseph",
    "Susan",
  ]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
    "Martin",
    "Thompson",
    "Garcia",
    "Martinez",
    "Robinson",
  ]

  const orders: Order[] = []

  for (let i = 1; i <= 200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const customer = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)]
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

    const location = cities[Math.floor(Math.random() * cities.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const houseNumber = Math.floor(Math.random() * 1000) + 1
    const address = `${houseNumber} ${street}`

    // Generate a random date within the last year
    const today = new Date()
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(today.getFullYear() - 1)
    const randomDate = new Date(oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime()))
    const date = randomDate.toISOString().split("T")[0]

    // Generate random items
    const numItems = Math.floor(Math.random() * 4) + 1
    const items = []
    let total = 0

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      })
      total += product.price * quantity
    }

    // Add shipping cost
    total += 9.99

    // Round to 2 decimal places
    total = Math.round(total * 100) / 100

    // Generate shipping details
    const carrier =
      status === "shipped" || status === "completed" ? carriers[Math.floor(Math.random() * carriers.length)] : ""
    const trackingNumber = carrier
      ? `${carrier.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 10000000000)}`
      : ""

    // Generate payment details
    const cardLast4 =
      paymentMethod === "Credit Card" ? `${Math.floor(Math.random() * 10000)}`.padStart(4, "0") : undefined
    const transactionId =
      paymentStatus === "paid" || paymentStatus === "refunded"
        ? `txn_${Math.random().toString(36).substring(2, 12)}`
        : ""
    const datePaid = transactionId ? date : ""

    orders.push({
      id: `ORD-${String(i).padStart(3, "0")}`,
      customer,
      email,
      date,
      total,
      status,
      paymentStatus,
      paymentMethod,
      items,
      shipping: {
        address,
        city: location.city,
        state: location.state,
        zip: location.zip,
        country: "USA",
        carrier,
        trackingNumber,
        estimatedDelivery: carrier
          ? new Date(new Date(date).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : "",
      },
      payment: {
        method: paymentMethod,
        cardLast4,
        transactionId,
        datePaid,
        refundId: paymentStatus === "refunded" ? `ref_${Math.random().toString(36).substring(2, 9)}` : undefined,
        dateRefunded:
          paymentStatus === "refunded"
            ? new Date(new Date(date).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            : undefined,
      },
      notes:
        Math.random() > 0.7
          ? [
              "Please handle with care",
              "Gift wrap requested",
              "Call before delivery",
              "Leave at the door",
              "Signature required",
            ][Math.floor(Math.random() * 5)]
          : "",
    })
  }

  return orders
}

const mockOrders: Order[] = generateMockOrders()

// Helper function to get orders from localStorage or mock data
const getOrdersFromStorage = (): Order[] => {
  if (typeof window !== "undefined") {
    try {
      const savedOrders = localStorage.getItem("orders")
      if (savedOrders) {
        return JSON.parse(savedOrders)
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage:", error)
    }
  }
  return mockOrders
}

// Initialize localStorage with mock orders if it doesn't exist
const initializeOrdersStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const savedOrders = localStorage.getItem("orders")
      if (!savedOrders) {
        localStorage.setItem("orders", JSON.stringify(mockOrders))
      }
    } catch (error) {
      console.error("Failed to initialize orders in localStorage:", error)
    }
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  // Replace the existing daysFilter and dateRange states with:
  const [daysFilter, setDaysFilter] = useState<string>("all")
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: undefined, to: undefined })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)
  const [refreshing, setRefreshing] = useState(false)
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null)

  const router = useRouter()

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = () => {
      try {
        setIsLoading(true)
        // Initialize localStorage with mock orders if needed
        initializeOrdersStorage()

        const loadedOrders = getOrdersFromStorage()
        setOrders(loadedOrders)
      } catch (error) {
        console.error("Error loading orders:", error)
        showNotification("error", "Failed to load orders")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()

    // Listen for storage changes (if another tab updates orders)
    const handleStorageChange = () => {
      setOrders(getOrdersFromStorage())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Show notification helper
  const showNotification = (type: string, message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Refresh orders data
  const refreshData = () => {
    setRefreshing(true)
    setTimeout(() => {
      setOrders(getOrdersFromStorage())
      setRefreshing(false)
      showNotification("success", "Orders refreshed successfully")
    }, 800)
  }

  // Filter orders based on search term and filters
  // Replace the existing filteredOrders logic with:
  const filteredOrders = orders.filter((order) => {
    // Apply search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply status filter
    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    // Apply payment status filter
    const matchesPaymentStatus = filterPaymentStatus === "all" || order.paymentStatus === filterPaymentStatus

    // Apply days filter (preset ranges)
    const orderDate = new Date(order.date)
    const today = new Date()
    let matchesDaysFilter = true

    if (daysFilter === "today") {
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      matchesDaysFilter = orderDate >= todayStart && orderDate < todayEnd
    } else if (daysFilter === "7") {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)
      matchesDaysFilter = orderDate >= sevenDaysAgo
    } else if (daysFilter === "30") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(today.getDate() - 30)
      matchesDaysFilter = orderDate >= thirtyDaysAgo
    } else if (daysFilter === "90") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(today.getDate() - 90)
      matchesDaysFilter = orderDate >= ninetyDaysAgo
    }

    // Apply custom date range filter
    const matchesCustomDateRange = (() => {
      if (!customDateRange.from && !customDateRange.to) {
        return true // No custom range set, so don't filter
      }

      const orderDate = new Date(order.date)

      // If only 'from' date is set
      if (customDateRange.from && !customDateRange.to) {
        return orderDate >= customDateRange.from
      }

      // If only 'to' date is set
      if (!customDateRange.from && customDateRange.to) {
        return orderDate <= customDateRange.to
      }

      // If both dates are set
      if (customDateRange.from && customDateRange.to) {
        return orderDate >= customDateRange.from && orderDate <= customDateRange.to
      }

      return true
    })()

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDaysFilter && matchesCustomDateRange
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortOrder === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage)

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    try {
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      setOrders(updatedOrders)

      // Save to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))

      showNotification("success", `Order ${orderId} status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating order status:", error)
      showNotification("error", "Failed to update order status")
    }
  }

  // Update payment status
  const updatePaymentStatus = (orderId: string, newStatus: string) => {
    try {
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
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))

      showNotification("success", `Order ${orderId} payment status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating payment status:", error)
      showNotification("error", "Failed to update payment status")
    }
  }

  // Generate invoice for an order
  const generateInvoice = (order: Order) => {
    try {
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

      showNotification("success", `Invoice for order ${order.id} generated successfully`)
    } catch (error) {
      console.error("Error generating invoice:", error)
      showNotification("error", "Failed to generate invoice")
    }
  }

  // Export orders to CSV
  const exportOrdersCSV = () => {
    try {
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

      showNotification("success", "Orders exported to CSV successfully")
    } catch (error) {
      console.error("Error exporting orders:", error)
      showNotification("error", "Failed to export orders")
    }
  }

  // Helper function to get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Shipped
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Helper function to get payment status badge variant
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Paid
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Refunded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Notification */}
      {notification && (
        <Alert
          variant={notification.type === "error" ? "destructive" : "default"}
          className="mb-6 fixed top-4 right-4 w-96 z-50 shadow-lg animate-in fade-in slide-in-from-top-5"
        >
          {notification.type === "error" ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{notification.type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and process customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportOrdersCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilterStatus("all")}>
            All Orders
          </TabsTrigger>
          <TabsTrigger value="pending" onClick={() => setFilterStatus("pending")}>
            Pending
          </TabsTrigger>
          <TabsTrigger value="processing" onClick={() => setFilterStatus("processing")}>
            Processing
          </TabsTrigger>
          <TabsTrigger value="shipped" onClick={() => setFilterStatus("shipped")}>
            Shipped
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilterStatus("completed")}>
            Completed
          </TabsTrigger>
          <TabsTrigger value="cancelled" onClick={() => setFilterStatus("cancelled")}>
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Refine the orders list using filters</CardDescription>
        </CardHeader>
      </Card>
      {/* Replace the filtering section in the Card with the new separated filters: */}
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Payment Status</SelectLabel>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort Order</SelectLabel>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Separate Days Filter */}
          <Select value={daysFilter} onValueChange={setDaysFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Quick Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Quick Date Filters</SelectLabel>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Custom Date Range Picker - FIXED VERSION */}
          <div className="md:col-span-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "MMM dd, y")} - {format(customDateRange.to, "MMM dd, y")}
                      </>
                    ) : (
                      format(customDateRange.from, "MMM dd, y")
                    )
                  ) : (
                    <span>Select custom date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={customDateRange}
                  onSelect={(range) => {
                    console.log("Calendar selection:", range) // Debug log
                    setCustomDateRange(range || { from: undefined, to: undefined })
                  }}
                  numberOfMonths={2}
                />
                <div className="p-3 border-t flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCustomDateRange({ from: undefined, to: undefined })
                    }}
                  >
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setCalendarOpen(false)}>
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {(daysFilter !== "all" || customDateRange.from || customDateRange.to) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {daysFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {daysFilter === "today"
                  ? "Today"
                  : daysFilter === "7"
                    ? "Last 7 days"
                    : daysFilter === "30"
                      ? "Last 30 days"
                      : daysFilter === "90"
                        ? "Last 90 days"
                        : daysFilter}
                <button onClick={() => setDaysFilter("all")} className="ml-1 hover:bg-muted rounded-full">
                  ×
                </button>
              </Badge>
            )}
            {(customDateRange.from || customDateRange.to) && (
              <Badge variant="secondary" className="gap-1">
                Custom: {customDateRange.from ? format(customDateRange.from, "MMM dd") : "?"} -{" "}
                {customDateRange.to ? format(customDateRange.to, "MMM dd") : "?"}
                <button
                  onClick={() => setCustomDateRange({ from: undefined, to: undefined })}
                  className="ml-1 hover:bg-muted rounded-full"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Orders List</CardTitle>
          <CardDescription>
            Showing {currentOrders.length} of {sortedOrders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              {/* Update the reset filters function in the "No orders found" section: */}
              <Button
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                  setFilterPaymentStatus("all")
                  setDaysFilter("all")
                  setCustomDateRange({ from: undefined, to: undefined })
                  setSortOrder("newest")
                  setCurrentPage(1)
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{order.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer}</div>
                          <div className="text-sm text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm truncate max-w-[150px]">
                          {order.shipping.address}, {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                      <TableCell>
                        {order.shipping.trackingNumber ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{order.shipping.carrier}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {order.shipping.trackingNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not shipped</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}`)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "pending")}>
                                <Clock className="mr-2 h-4 w-4" />
                                Set as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                                <Package className="mr-2 h-4 w-4" />
                                Set as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Set as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "completed")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Set as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "cancelled")}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Set as Cancelled
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Payment</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updatePaymentStatus(order.id, "paid")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updatePaymentStatus(order.id, "refunded")}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Mark as Refunded
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => generateInvoice(order)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && sortedOrders.length > 0 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pages around current page
                    let pageNum = i + 1
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 3 + i
                      }
                      if (currentPage > totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      }
                    }

                    if (pageNum <= totalPages) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink isActive={currentPage === pageNum} onClick={() => setCurrentPage(pageNum)}>
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

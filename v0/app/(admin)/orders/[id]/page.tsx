"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Package,
  Truck,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Mail,
  DollarSign,
  Clock,
  ExternalLink,
  RefreshCw,
  ShoppingBag,
  ChevronRight,
  Printer,
  Plus,
  Phone,
  Building,
  Tag,
  Send,
  Archive,
  Trash2,
  MoreHorizontal,
  XCircle,
  AlertCircle,
  Info,
  Copy,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Remove the existing jsPDF import and replace with this
// import jsPDF from "jspdf"

// Define TypeScript interfaces
interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  sku?: string
  image?: string
}

interface ShippingInfo {
  address: string
  city: string
  state: string
  zip: string
  country: string
  carrier?: string
  trackingNumber?: string
  estimatedDelivery?: string
  shippingMethod?: string
  shippingCost?: number
}

interface PaymentInfo {
  method: string
  cardLast4?: string
  transactionId?: string
  datePaid?: string
  refundId?: string
  dateRefunded?: string
  amount?: number
}

interface CustomerInfo {
  id?: string
  name: string
  email: string
  phone?: string
  company?: string
  totalOrders?: number
  totalSpent?: number
  firstOrderDate?: string
}

interface OrderHistory {
  date: string
  status: string
  note: string
  user?: string
}

interface Order {
  id: string
  customer: string
  email: string
  date: string
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  items: OrderItem[]
  shipping: ShippingInfo
  payment: PaymentInfo
  notes?: string
  customerInfo?: CustomerInfo
  history?: OrderHistory[]
  subtotal?: number
  tax?: number
  discount?: number
  discountCode?: string
}

interface EditMode {
  shipping: boolean
  payment: boolean
  notes: boolean
  customer: boolean
  items: boolean
}

interface FormData {
  shipping: {
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
    shippingMethod: string
  }
  payment: {
    transactionId: string
    datePaid: string
  }
  notes: string
  customer: {
    name: string
    email: string
    phone: string
    company: string
  }
}

interface Notification {
  type: "success" | "error" | "warning" | "info"
  message: string
}

// Helper function to get orders from localStorage or mock data
function getOrdersFromStorage(): Order[] {
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
  return []
}

// Initialize localStorage with mock orders if it doesn't exist
function initializeOrdersStorage(): void {
  if (typeof window !== "undefined") {
    try {
      const savedOrders = localStorage.getItem("orders")
      if (!savedOrders) {
        localStorage.setItem("orders", JSON.stringify([]))
      }
    } catch (error) {
      console.error("Failed to initialize orders in localStorage:", error)
    }
  }
}

// Add the missing import
import { useRouter } from "next/navigation"

// Main component
export default function OrderDetailsPage({ params }: { params: { id: string } }): JSX.Element {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [editMode, setEditMode] = useState<EditMode>({
    shipping: false,
    payment: false,
    notes: false,
    customer: false,
    items: false,
  })
  const [formData, setFormData] = useState<FormData>({
    shipping: {
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
      shippingMethod: "",
    },
    payment: {
      transactionId: "",
      datePaid: "",
    },
    notes: "",
    customer: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  })
  const [notification, setNotification] = useState<Notification | null>(null)
  const [orderNotFound, setOrderNotFound] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("details")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
  const [confirmAction, setConfirmAction] = useState<{ action: string; payload?: any }>({ action: "" })
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState<boolean>(false)
  const [packingSlipDialogOpen, setPackingSlipDialogOpen] = useState<boolean>(false)
  const { id } = params

  // Add the router
  const router = useRouter()

  useEffect(() => {
    // Initialize localStorage with mock orders if needed
    initializeOrdersStorage()

    // Fetch order details
    const fetchOrder = () => {
      setLoading(true)
      try {
        const orders = getOrdersFromStorage()
        const foundOrder = orders.find((order) => order.id === id)

        if (foundOrder) {
          // Add history if it doesn't exist
          if (!foundOrder.history) {
            foundOrder.history = [
              {
                date: foundOrder.date,
                status: "created",
                note: "Order created",
                user: "System",
              },
            ]

            // Add status changes to history based on current status
            if (foundOrder.status !== "pending") {
              const statusDate = new Date(new Date(foundOrder.date).getTime() + 24 * 60 * 60 * 1000)
              foundOrder.history.push({
                date: statusDate.toISOString().split("T")[0],
                status: foundOrder.status,
                note: `Order status changed to ${foundOrder.status}`,
                user: "Admin",
              })
            }

            // Add payment history
            if (foundOrder.paymentStatus === "paid" && foundOrder.payment.datePaid) {
              foundOrder.history.push({
                date: foundOrder.payment.datePaid,
                status: "payment",
                note: `Payment received via ${foundOrder.payment.method}`,
                user: "System",
              })
            }
          }

          // Calculate subtotal if not present
          if (!foundOrder.subtotal) {
            foundOrder.subtotal = foundOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
          }

          // Add tax if not present (assume 8%)
          if (!foundOrder.tax) {
            foundOrder.tax = Number.parseFloat((foundOrder.subtotal * 0.08).toFixed(2))
          }

          // Add customer info if not present
          if (!foundOrder.customerInfo) {
            foundOrder.customerInfo = {
              id: `CUST-${Math.floor(Math.random() * 10000)}`,
              name: foundOrder.customer,
              email: foundOrder.email,
              phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
              company: Math.random() > 0.5 ? "Acme Inc." : "",
              totalOrders: Math.floor(Math.random() * 10) + 1,
              totalSpent: Number.parseFloat((Math.random() * 1000 + 100).toFixed(2)),
              firstOrderDate: new Date(new Date(foundOrder.date).getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            }
          }

          setOrder(foundOrder)
          setFormData({
            shipping: {
              carrier: foundOrder.shipping?.carrier || "",
              trackingNumber: foundOrder.shipping?.trackingNumber || "",
              estimatedDelivery: foundOrder.shipping?.estimatedDelivery || "",
              shippingMethod: foundOrder.shipping?.shippingMethod || "Standard Shipping",
            },
            payment: {
              transactionId: foundOrder.payment?.transactionId || "",
              datePaid: foundOrder.payment?.datePaid || "",
            },
            notes: foundOrder.notes || "",
            customer: {
              name: foundOrder.customerInfo?.name || foundOrder.customer,
              email: foundOrder.customerInfo?.email || foundOrder.email,
              phone: foundOrder.customerInfo?.phone || "",
              company: foundOrder.customerInfo?.company || "",
            },
          })
        } else {
          setOrderNotFound(true)
          showNotification("error", `Order ${id} not found`)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        showNotification("error", "Error loading order details")
        setOrderNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  // Show notification helper
  const showNotification = (type: "success" | "error" | "warning" | "info", message: string): void => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const generateInvoiceHTML = (): string => {
    if (!order) return ""

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice-${order.id}</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      
      * { 
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
        font-size: 11px;
        line-height: 1.3;
        color: #333;
        background: white;
      }
      
      .page {
        width: 210mm;
        height: 297mm;
        padding: 12mm;
        margin: 0 auto;
        background: white;
        display: flex;
        flex-direction: column;
        position: relative;
      }
      
      .header {
        text-align: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e5e7eb;
      }
      
      .company-name {
        font-size: 22px;
        font-weight: bold;
        color: #2563eb;
        margin-bottom: 2px;
      }
      
      .company-tagline {
        color: #6b7280;
        font-size: 10px;
      }
      
      .invoice-title {
        font-size: 24px;
        font-weight: 300;
        margin: 10px 0;
        text-align: center;
        color: #1f2937;
        letter-spacing: 1px;
      }
      
      .invoice-details {
        background: #f9fafb;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
        font-size: 10px;
      }
      
      .invoice-details-grid {
        display: flex;
        justify-content: space-between;
      }
      
      .address-section {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;
        gap: 20px;
      }
      
      .address-block {
        flex: 1;
        font-size: 10px;
      }
      
      .address-block h3 {
        color: #2563eb;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 5px;
        font-weight: 600;
      }
      
      .address-block p {
        margin: 1px 0;
        line-height: 1.3;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 10px;
      }
      
      th {
        background-color: #2563eb;
        color: white;
        padding: 6px;
        text-align: left;
        font-weight: 500;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      
      td {
        padding: 5px 6px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: top;
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      .totals-section {
        margin-left: auto;
        width: 200px;
        margin-top: 10px;
      }
      
      .totals-table {
        width: 100%;
        font-size: 10px;
      }
      
      .totals-table td {
        padding: 3px 6px;
        border: none;
      }
      
      .totals-table tr:last-child {
        border-top: 2px solid #2563eb;
        font-size: 12px;
        font-weight: bold;
        color: #1f2937;
      }
      
      .footer {
        margin-top: auto;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        color: #6b7280;
        font-size: 9px;
      }
      
      .footer p {
        margin: 1px 0;
      }
      
      /* Ensure single page */
      .page-break-inside-avoid {
        page-break-inside: avoid;
      }
      
      @media print {
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .page {
          margin: 0;
          border: initial;
          border-radius: initial;
          width: initial;
          min-height: initial;
          box-shadow: initial;
          background: initial;
          page-break-after: avoid;
        }
        
        .no-print {
          display: none !important;
        }
        
        /* Force single page */
        html, body {
          height: 297mm;
          width: 210mm;
        }
      }
      
      /* Responsive for screen viewing */
      @media screen and (max-width: 210mm) {
        .page {
          width: 100%;
          height: auto;
          padding: 20px;
        }
        
        .address-section {
          flex-direction: column;
          gap: 15px;
        }
        
        .totals-section {
          width: 100%;
          max-width: 300px;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header page-break-inside-avoid">
        <div class="company-name">PRANA AIR</div>
        <div class="company-tagline">Premium Air Quality Solutions</div>
      </div>
      
      <div class="invoice-title page-break-inside-avoid">INVOICE</div>
      
      <div class="invoice-details page-break-inside-avoid">
        <div class="invoice-details-grid">
          <div>
            <strong>Invoice Number:</strong> INV-${order.id.replace("ORD-", "")}<br>
            <strong>Invoice Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
          <div style="text-align: right;">
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>
      
      <div class="address-section page-break-inside-avoid">
        <div class="address-block">
          <h3>Bill To</h3>
          <p><strong>${order.customer}</strong></p>
          <p>${order.email}</p>
          <p>${order.shipping?.address || "Address not provided"}</p>
          <p>${order.shipping?.city || ""}, ${order.shipping?.state || ""} ${order.shipping?.zip || ""}</p>
          <p>${order.shipping?.country || ""}</p>
        </div>
        <div class="address-block" style="text-align: right;">
          <h3>Payment Information</h3>
          <p><strong>Method:</strong> ${order.payment?.method || "N/A"}</p>
          ${order.payment?.cardLast4 ? `<p>Card: **** ${order.payment.cardLast4}</p>` : ""}
          ${order.payment?.transactionId ? `<p>Trans: ${order.payment.transactionId}</p>` : ""}
          ${order.payment?.datePaid ? `<p>Paid: ${new Date(order.payment.datePaid).toLocaleDateString()}</p>` : ""}
        </div>
      </div>
      
      <table class="page-break-inside-avoid">
        <thead>
          <tr>
            <th style="width: 50%;">Item Description</th>
            <th style="width: 15%; text-align: center;">Qty</th>
            <th style="width: 15%; text-align: right;">Price</th>
            <th style="width: 20%; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>
                <strong>${item.name}</strong>
                ${item.sku ? `<br><small style="color: #6b7280; font-size: 9px;">SKU: ${item.sku}</small>` : ""}
              </td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">$${item.price.toFixed(2)}</td>
              <td style="text-align: right;"><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="totals-section page-break-inside-avoid">
        <table class="totals-table">
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">$${(order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td style="text-align: right;">$${(order.shipping?.shippingCost || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Tax:</td>
            <td style="text-align: right;">$${(order.tax || 0).toFixed(2)}</td>
          </tr>
          ${
            order.discount
              ? `
            <tr style="color: #059669;">
              <td>Discount${order.discountCode ? ` (${order.discountCode})` : ""}:</td>
              <td style="text-align: right;">-$${order.discount.toFixed(2)}</td>
            </tr>
          `
              : ""
          }
          <tr>
            <td>Total Due:</td>
            <td style="text-align: right;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      <div class="footer page-break-inside-avoid">
        <p><strong>Thank you for your business!</strong></p>
        <p>For questions about this invoice, please contact us at support@pranaair.com</p>
        <p>Payment is due within 30 days of invoice date.</p>
      </div>
    </div>
  </body>
  </html>
`
  }

  const generatePackingSlipHTML = (): string => {
    if (!order) return ""

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PackingSlip-${order.id}</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      
      * { 
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
        font-size: 11px;
        line-height: 1.3;
        color: #333;
        background: white;
      }
      
      .page {
        width: 210mm;
        height: 297mm;
        padding: 12mm;
        margin: 0 auto;
        background: white;
        display: flex;
        flex-direction: column;
        position: relative;
      }
      
      .header {
        text-align: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e5e7eb;
      }
      
      .company-name {
        font-size: 22px;
        font-weight: bold;
        color: #8b5cf6;
        margin-bottom: 2px;
      }
      
      .company-tagline {
        color: #6b7280;
        font-size: 10px;
      }
      
      .slip-title {
        font-size: 24px;
        font-weight: 300;
        margin: 10px 0;
        text-align: center;
        color: #1f2937;
        letter-spacing: 1px;
      }
      
      .order-details {
        background: #f9fafb;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
        font-size: 10px;
      }
      
      .order-details-grid {
        display: flex;
        justify-content: space-between;
      }
      
      .address-section {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;
        gap: 20px;
      }
      
      .address-block {
        flex: 1;
        font-size: 10px;
      }
      
      .address-block h3 {
        color: #8b5cf6;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 5px;
        font-weight: 600;
      }
      
      .address-block p {
        margin: 1px 0;
        line-height: 1.3;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        font-size: 10px;
      }
      
      th {
        background-color: #8b5cf6;
        color: white;
        padding: 6px;
        text-align: left;
        font-weight: 500;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      
      td {
        padding: 5px 6px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: top;
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      .checkbox {
        width: 12px;
        height: 12px;
        border: 1.5px solid #6b7280;
        display: inline-block;
        border-radius: 2px;
        vertical-align: middle;
      }
      
      .instructions {
        background: #fef3c7;
        padding: 8px;
        margin: 10px 0;
        border-radius: 4px;
        border: 1px solid #fcd34d;
      }
      
      .instructions h3 {
        color: #92400e;
        margin-bottom: 3px;
        font-size: 11px;
      }
      
      .instructions p {
        font-size: 10px;
      }
      
      .quality-check {
        background: #f3f4f6;
        padding: 12px;
        margin: 10px 0;
        border-radius: 4px;
        text-align: center;
      }
      
      .quality-check h3 {
        font-size: 12px;
        margin-bottom: 8px;
      }
      
      .checklist {
        text-align: left;
        max-width: 250px;
        margin: 8px auto;
      }
      
      .checklist p {
        margin: 3px 0;
        font-size: 10px;
      }
      
      .signature-section {
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
        gap: 15px;
      }
      
      .signature-block {
        text-align: center;
        flex: 1;
      }
      
      .signature-block p {
        font-size: 10px;
        margin: 2px 0;
      }
      
      .signature-line {
        border-bottom: 1px solid #6b7280;
        width: 100%;
        display: inline-block;
        margin: 3px 0;
      }
      
      /* Ensure single page */
      .page-break-inside-avoid {
        page-break-inside: avoid;
      }
      
      @media print {
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .page {
          margin: 0;
          border: initial;
          border-radius: initial;
          width: initial;
          min-height: initial;
          box-shadow: initial;
          background: initial;
          page-break-after: avoid;
        }
        
        .no-print {
          display: none !important;
        }
        
        /* Force single page */
        html, body {
          height: 297mm;
          width: 210mm;
        }
      }
      
      /* Responsive for screen viewing */
      @media screen and (max-width: 210mm) {
        .page {
          width: 100%;
          height: auto;
          padding: 20px;
        }
        
        .address-section {
          flex-direction: column;
          gap: 15px;
        }
        
        .signature-section {
          flex-direction: column;
          gap: 10px;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header page-break-inside-avoid">
        <div class="company-name">PRANA AIR</div>
        <div class="company-tagline">Premium Air Quality Solutions</div>
      </div>
      
      <div class="slip-title page-break-inside-avoid">PACKING SLIP</div>
      
      <div class="order-details page-break-inside-avoid">
        <div class="order-details-grid">
          <div>
            <strong>Order ID:</strong> ${order.id}<br>
            <strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
          <div style="text-align: right;">
            <strong>Customer:</strong> ${order.customer}<br>
            <strong>Packed Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>
      
      <div class="address-section page-break-inside-avoid">
        <div class="address-block">
          <h3>Ship To</h3>
          <p><strong>${order.customer}</strong></p>
          <p>${order.shipping?.address || "Address not provided"}</p>
          <p>${order.shipping?.city || ""}, ${order.shipping?.state || ""} ${order.shipping?.zip || ""}</p>
          <p>${order.shipping?.country || ""}</p>
        </div>
        <div class="address-block" style="text-align: right;">
          <h3>Shipping Information</h3>
          <p><strong>Method:</strong> ${order.shipping?.shippingMethod || "Standard"}</p>
          <p><strong>Carrier:</strong> ${order.shipping?.carrier || "TBD"}</p>
          ${order.shipping?.trackingNumber ? `<p><strong>Tracking:</strong> ${order.shipping.trackingNumber}</p>` : ""}
          ${order.shipping?.estimatedDelivery ? `<p><strong>Est. Delivery:</strong> ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>` : ""}
        </div>
      </div>
      
      <table class="page-break-inside-avoid">
        <thead>
          <tr>
            <th style="width: 50%;">Item to Pack</th>
            <th style="width: 15%;">SKU</th>
            <th style="width: 15%; text-align: center;">Qty</th>
            <th style="width: 20%; text-align: center;">Packed</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td><strong>${item.name}</strong></td>
              <td>${item.sku || "N/A"}</td>
              <td style="text-align: center;"><strong>${item.quantity}</strong></td>
              <td style="text-align: center;">
                <span class="checkbox"></span>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      ${
        order.notes
          ? `
        <div class="instructions page-break-inside-avoid">
          <h3>Special Instructions</h3>
          <p>${order.notes}</p>
        </div>
      `
          : ""
      }
      
      <div class="quality-check page-break-inside-avoid">
        <h3>Quality Control Checklist</h3>
        <div class="checklist">
          <p><span class="checkbox"></span> All items packed correctly</p>
          <p><span class="checkbox"></span> Items inspected for damage</p>
          <p><span class="checkbox"></span> Packaging secure and sealed</p>
          <p><span class="checkbox"></span> Shipping label attached</p>
          <p><span class="checkbox"></span> Invoice/receipt included</p>
        </div>
        
        <div class="signature-section">
          <div class="signature-block">
            <p>Packed by:</p>
            <div class="signature-line"></div>
            <p>Date: _______________</p>
          </div>
          <div class="signature-block">
            <p>Checked by:</p>
            <div class="signature-line"></div>
            <p>Date: _______________</p>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
`
  }

  const openInvoice = (): void => {
    if (!order) return

    try {
      const invoiceHTML = generateInvoiceHTML()

      // Open the invoice in a new window
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(invoiceHTML)
        printWindow.document.close()
        printWindow.focus()
      } else {
        showNotification("warning", "Please allow pop-ups to view the invoice")
      }

      showNotification("success", "Invoice opened successfully")
    } catch (error) {
      console.error("Error generating invoice:", error)
      showNotification("error", "Failed to generate invoice")
    }
  }

  const openPackingSlip = (): void => {
    if (!order) return

    try {
      const packingSlipHTML = generatePackingSlipHTML()

      // Open the packing slip in a new window
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(packingSlipHTML)
        printWindow.document.close()
        printWindow.focus()
      } else {
        showNotification("warning", "Please allow pop-ups to view the packing slip")
      }

      showNotification("success", "Packing slip opened successfully")
    } catch (error) {
      console.error("Error generating packing slip:", error)
      showNotification("error", "Failed to generate packing slip")
    }
  }

  const downloadInvoice = (): void => {
    if (!order) return

    try {
      const invoiceHTML = generateInvoiceHTML()

      // Create a hidden iframe
      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.right = "0"
      iframe.style.bottom = "0"
      iframe.style.width = "0"
      iframe.style.height = "0"
      iframe.style.border = "0"
      document.body.appendChild(iframe)

      // Write content to iframe
      const doc = iframe.contentWindow?.document
      if (!doc) {
        console.error("Could not access iframe document")
        document.body.removeChild(iframe)
        return
      }

      // Modify HTML to include auto-print script
      const printHTML = invoiceHTML.replace(
        "</body>",
        `<script>
        window.onload = function() {
          // Set suggested filename for PDF
          document.title = 'Invoice-${order.id}.pdf';
          
          // Auto trigger print
          setTimeout(function() {
            window.print();
            
            // Close window after print dialog
            window.onafterprint = function() {
              window.close();
            };
          }, 100);
        }
      </script>
      </body>`,
      )

      doc.open()
      doc.write(printHTML)
      doc.close()

      // Show notification
      showNotification("info", "Opening PDF save dialog... Choose 'Save as PDF' as destination")

      // Clean up after delay
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 5000)
    } catch (error) {
      console.error("Error generating invoice PDF:", error)
      showNotification("error", "Failed to generate invoice PDF")
    }
  }

  const downloadPackingSlip = (): void => {
    if (!order) return

    try {
      const packingSlipHTML = generatePackingSlipHTML()

      // Create a hidden iframe
      const iframe = document.createElement("iframe")
      iframe.style.position = "fixed"
      iframe.style.right = "0"
      iframe.style.bottom = "0"
      iframe.style.width = "0"
      iframe.style.height = "0"
      iframe.style.border = "0"
      document.body.appendChild(iframe)

      // Write content to iframe
      const doc = iframe.contentWindow?.document
      if (!doc) {
        console.error("Could not access iframe document")
        document.body.removeChild(iframe)
        return
      }

      // Modify HTML to include auto-print script
      const printHTML = packingSlipHTML.replace(
        "</body>",
        `<script>
        window.onload = function() {
          // Set suggested filename for PDF
          document.title = 'PackingSlip-${order.id}.pdf';
          
          // Auto trigger print
          setTimeout(function() {
            window.print();
            
            // Close window after print dialog
            window.onafterprint = function() {
              window.close();
            };
          }, 100);
        }
      </script>
      </body>`,
      )

      doc.open()
      doc.write(printHTML)
      doc.close()

      // Show notification
      showNotification("info", "Opening PDF save dialog... Choose 'Save as PDF' as destination")

      // Clean up after delay
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 5000)
    } catch (error) {
      console.error("Error generating packing slip PDF:", error)
      showNotification("error", "Failed to generate packing slip PDF")
    }
  }

  const updateOrderStatus = (newStatus: string): void => {
    if (!order) return

    try {
      // Get all orders
      const orders = getOrdersFromStorage()

      // Create a history entry
      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        status: newStatus,
        note: `Order status changed to ${newStatus}`,
        user: "Admin",
      }

      // Find and update the order
      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            status: newStatus,
            history: [...(o.history || []), historyEntry],
          }
        }
        return o
      })

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update local state
      setOrder({
        ...order,
        status: newStatus,
        history: [...(order.history || []), historyEntry],
      })

      // Show success message
      showNotification("success", `Order status updated to ${newStatus}`)

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error updating order status:", error)
      showNotification("error", "Failed to update order status")
    }
  }

  const updatePaymentStatus = (newStatus: string): void => {
    if (!order) return

    try {
      // Get all orders
      const orders = getOrdersFromStorage()

      // Create updated payment info
      const updatedPayment = { ...order.payment }

      // Create a history entry
      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        status: "payment_" + newStatus,
        note: `Payment status changed to ${newStatus}`,
        user: "Admin",
      }

      // Update payment details based on status
      if (newStatus === "paid" && !order.payment.transactionId) {
        updatedPayment.transactionId = `txn_${Math.random().toString(36).substring(2, 10)}`
        updatedPayment.datePaid = new Date().toISOString().split("T")[0]
        historyEntry.note = `Payment received via ${order.payment.method}`
      } else if (newStatus === "refunded") {
        updatedPayment.refundId = `ref_${Math.random().toString(36).substring(2, 9)}`
        updatedPayment.dateRefunded = new Date().toISOString().split("T")[0]
        historyEntry.note = `Payment refunded (${updatedPayment.refundId})`
      }

      // Find and update the order
      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            paymentStatus: newStatus,
            payment: updatedPayment,
            history: [...(o.history || []), historyEntry],
          }
        }
        return o
      })

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update local state
      setOrder({
        ...order,
        paymentStatus: newStatus,
        payment: updatedPayment,
        history: [...(order.history || []), historyEntry],
      })

      // Show success message
      showNotification("success", `Payment status updated to ${newStatus}`)

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error updating payment status:", error)
      showNotification("error", "Failed to update payment status")
    }
  }

  const handleInputChange = (section: string, field: string | null, value: string): void => {
    setFormData({
      ...formData,
      [section]:
        section === "notes"
          ? value
          : {
              ...formData[section as keyof FormData],
              [field as string]: value,
            },
    })
  }

  const saveChanges = (section: keyof EditMode): void => {
    if (!order) return

    setSaving(true)
    try {
      // Get all orders
      const orders = getOrdersFromStorage()

      // Create updated order object
      const updatedOrder = { ...order }

      // Create a history entry
      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        status: "updated",
        note: `${section.charAt(0).toUpperCase() + section.slice(1)} information updated`,
        user: "Admin",
      }

      if (section === "shipping") {
        updatedOrder.shipping = {
          ...updatedOrder.shipping,
          carrier: formData.shipping.carrier,
          trackingNumber: formData.shipping.trackingNumber,
          estimatedDelivery: formData.shipping.estimatedDelivery,
          shippingMethod: formData.shipping.shippingMethod,
        }
        historyEntry.note = `Shipping information updated (${formData.shipping.carrier} - ${formData.shipping.trackingNumber})`
      } else if (section === "payment") {
        updatedOrder.payment = {
          ...updatedOrder.payment,
          transactionId: formData.payment.transactionId,
          datePaid: formData.payment.datePaid,
        }
        historyEntry.note = `Payment information updated (${formData.payment.transactionId})`
      } else if (section === "notes") {
        updatedOrder.notes = formData.notes
        historyEntry.note = "Order notes updated"
      } else if (section === "customer") {
        updatedOrder.customer = formData.customer.name
        updatedOrder.email = formData.customer.email
        if (updatedOrder.customerInfo) {
          updatedOrder.customerInfo = {
            ...updatedOrder.customerInfo,
            name: formData.customer.name,
            email: formData.customer.email,
            phone: formData.customer.phone,
            company: formData.customer.company,
          }
        }
        historyEntry.note = "Customer information updated"
      }

      // Add history entry
      updatedOrder.history = [...(updatedOrder.history || []), historyEntry]

      // Find and update the order
      const updatedOrders = orders.map((o) => (o.id === order.id ? updatedOrder : o))

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update local state
      setOrder(updatedOrder)
      setEditMode({ ...editMode, [section]: false })

      // Show success message
      showNotification(
        "success",
        `${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully`,
      )

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error(`Error updating ${section} information:`, error)
      showNotification("error", `Failed to update ${section} information`)
    } finally {
      setSaving(false)
    }
  }

  const sendOrderConfirmation = (): void => {
    if (!order) return

    try {
      // In a real app, this would send an email

      // Add to history
      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        status: "notification",
        note: `Order confirmation email sent to ${order.email}`,
        user: "Admin",
      }

      // Get all orders
      const orders = getOrdersFromStorage()

      // Update the order with the new history entry
      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            history: [...(o.history || []), historyEntry],
          }
        }
        return o
      })

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update local state
      setOrder({
        ...order,
        history: [...(order.history || []), historyEntry],
      })

      showNotification("success", `Order confirmation email sent to ${order.email || "customer"}`)
    } catch (error) {
      console.error("Error sending confirmation:", error)
      showNotification("error", "Failed to send order confirmation")
    }
  }

  const markAsShipped = (): void => {
    if (!order) return

    if (!order.shipping?.carrier || !order.shipping?.trackingNumber) {
      showNotification("warning", "Please add shipping carrier and tracking number first")
      setEditMode({ ...editMode, shipping: true })
      return
    }

    updateOrderStatus("shipped")

    // In a real app, this would also send a shipping notification email
    setTimeout(() => {
      // Add to history
      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        status: "notification",
        note: `Shipping notification email sent to ${order.email}`,
        user: "System",
      }

      // Get all orders
      const orders = getOrdersFromStorage()

      // Update the order with the new history entry
      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            history: [...(o.history || []), historyEntry],
          }
        }
        return o
      })

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update local state
      setOrder({
        ...order,
        history: [...(order.history || []), historyEntry],
      })

      showNotification("success", "Shipping notification email sent to customer")
    }, 1000)
  }

  const handleConfirmAction = () => {
    if (!confirmAction.action) return

    switch (confirmAction.action) {
      case "cancel":
        updateOrderStatus("cancelled")
        break
      case "delete":
        deleteOrder()
        break
      case "refund":
        updatePaymentStatus("refunded")
        break
      default:
        break
    }

    setConfirmDialogOpen(false)
  }

  const deleteOrder = () => {
    if (!order) return

    try {
      // Get all orders
      const orders = getOrdersFromStorage()

      // Filter out the current order
      const updatedOrders = orders.filter((o) => o.id !== order.id)

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Show success message
      showNotification("success", `Order ${order.id} deleted successfully`)

      // Redirect to orders page
      window.location.href = "/admin/orders"

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error deleting order:", error)
      showNotification("error", "Failed to delete order")
    }
  }

  const archiveOrder = () => {
    if (!order) return

    try {
      // Get all orders
      const orders = getOrdersFromStorage()

      // Create a history entry
      const historyEntry = {
        date: new Date().toISOString().split("T")[0],
        status: "archived",
        note: "Order archived",
        user: "Admin",
      }

      // Find and update the order
      const updatedOrders = orders.map((o) => {
        if (o.id === order.id) {
          return {
            ...o,
            status: "archived",
            history: [...(o.history || []), historyEntry],
          }
        }
        return o
      })

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update local state
      setOrder({
        ...order,
        status: "archived",
        history: [...(order.history || []), historyEntry],
      })

      // Show success message
      showNotification("success", `Order ${order.id} archived successfully`)

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error archiving order:", error)
      showNotification("error", "Failed to archive order")
    }
  }

  // Helper function to get status badge variant
  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Package className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Truck className="mr-1 h-3 w-3" />
            Shipped
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Archive className="mr-1 h-3 w-3" />
            Archived
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Helper function to get payment status badge variant
  const getPaymentBadge = (status: string): JSX.Element => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <RefreshCw className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Helper function to get tracking URL
  const getTrackingUrl = (carrier?: string, trackingNumber?: string): string => {
    if (!carrier || !trackingNumber) return "#"

    switch (carrier) {
      case "FedEx":
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
      case "UPS":
        return `https://www.ups.com/track?tracknum=${trackingNumber}`
      case "USPS":
        return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
      case "DHL":
        return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
      default:
        return "#"
    }
  }

  // Create a new order if it doesn't exist
  const createNewOrder = (): void => {
    try {
      // Generate a new order ID
      const newOrderId = id

      // Create a new order object
      const newOrder: Order = {
        id: newOrderId,
        customer: "New Customer",
        email: "customer@example.com",
        date: new Date().toISOString().split("T")[0],
        total: 0,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "Credit Card",
        items: [],
        shipping: {
          address: "",
          city: "",
          state: "",
          zip: "",
          country: "USA",
          carrier: "",
          trackingNumber: "",
          estimatedDelivery: "",
          shippingMethod: "Standard Shipping",
        },
        payment: {
          method: "Credit Card",
          cardLast4: "",
          transactionId: "",
          datePaid: "",
        },
        notes: "",
        history: [
          {
            date: new Date().toISOString().split("T")[0],
            status: "created",
            note: "Order created manually",
            user: "Admin",
          },
        ],
        customerInfo: {
          id: `CUST-${Math.floor(Math.random() * 10000)}`,
          name: "New Customer",
          email: "customer@example.com",
          phone: "",
          company: "",
          totalOrders: 1,
          totalSpent: 0,
          firstOrderDate: new Date().toISOString().split("T")[0],
        },
        subtotal: 0,
        tax: 0,
      }

      // Get existing orders
      const orders = getOrdersFromStorage()

      // Add the new order
      const updatedOrders = [...orders, newOrder]

      // Save to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedOrders))

      // Update state
      setOrder(newOrder)
      setOrderNotFound(false)
      setFormData({
        shipping: {
          carrier: "",
          trackingNumber: "",
          estimatedDelivery: "",
          shippingMethod: "Standard Shipping",
        },
        payment: {
          transactionId: "",
          datePaid: "",
        },
        notes: "",
        customer: {
          name: "New Customer",
          email: "customer@example.com",
          phone: "",
          company: "",
        },
      })

      // Show success message
      showNotification("success", `New order ${newOrderId} created successfully`)

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))
    } catch (error) {
      console.error("Error creating new order:", error)
      showNotification("error", "Failed to create new order")
    }
  }

  // Copy order ID to clipboard
  const copyOrderId = () => {
    if (!order) return

    navigator.clipboard
      .writeText(order.id)
      .then(() => {
        showNotification("success", "Order ID copied to clipboard")
      })
      .catch(() => {
        showNotification("error", "Failed to copy order ID")
      })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-10 w-[150px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>

          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    )
  }

  if (orderNotFound) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find order {id} in our system. It may have been deleted or doesn't exist.
              </p>
              <div className="flex gap-4">
                <Link href="/admin/orders">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                  </Button>
                </Link>
                <Button variant="outline" onClick={createNewOrder}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order {id}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Order</AlertTitle>
          <AlertDescription>
            There was a problem loading the order details. Please try refreshing the page.
          </AlertDescription>
        </Alert>

        <Link href="/admin/orders" className="mt-4 inline-block">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Notification */}
      {notification && (
        <Alert
          variant={notification.type === "error" ? "destructive" : "default"}
          className="mb-6 fixed top-4 right-4 w-96 z-50 shadow-lg animate-in fade-in slide-in-from-top-5"
        >
          {notification.type === "error" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : notification.type === "warning" ? (
            <AlertCircle className="h-4 w-4" />
          ) : notification.type === "info" ? (
            <Info className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {notification.type === "error"
              ? "Error"
              : notification.type === "warning"
                ? "Warning"
                : notification.type === "info"
                  ? "Information"
                  : "Success"}
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* Invoice Dialog */}
      <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Invoice for Order {order.id}</DialogTitle>
            <DialogDescription>Preview the invoice before printing or downloading</DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={openInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
            <Button onClick={downloadInvoice}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Packing Slip Dialog */}
      <Dialog open={packingSlipDialogOpen} onOpenChange={setPackingSlipDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Packing Slip for Order {order.id}</DialogTitle>
            <DialogDescription>Preview the packing slip before printing or downloading</DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white">
            <div dangerouslySetInnerHTML={{ __html: generatePackingSlipHTML() }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPackingSlipDialogOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={openPackingSlip}>
              <Printer className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
            <Button onClick={downloadPackingSlip}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction.action === "cancel"
                ? "Cancel Order"
                : confirmAction.action === "delete"
                  ? "Delete Order"
                  : confirmAction.action === "refund"
                    ? "Refund Payment"
                    : "Confirm Action"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction.action === "cancel"
                ? "Are you sure you want to cancel this order? This action cannot be undone."
                : confirmAction.action === "delete"
                  ? "Are you sure you want to delete this order? This action cannot be undone and will permanently remove the order from the system."
                  : confirmAction.action === "refund"
                    ? "Are you sure you want to refund this payment? This will mark the payment as refunded."
                    : "Are you sure you want to proceed with this action?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction.action === "delete" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              {confirmAction.action === "cancel"
                ? "Yes, Cancel Order"
                : confirmAction.action === "delete"
                  ? "Yes, Delete Order"
                  : confirmAction.action === "refund"
                    ? "Yes, Refund Payment"
                    : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Breadcrumb */}
      <div className="flex items-center mb-6">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="mx-1 h-4 w-4" />
          <Link href="/admin/orders" className="hover:text-foreground">
            Orders
          </Link>
          <ChevronRight className="mx-1 h-4 w-4" />
          <span className="font-medium text-foreground">{order.id}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
            <Button variant="ghost" size="icon" onClick={copyOrderId} title="Copy Order ID">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {getStatusBadge(order.status)}
            {getPaymentBadge(order.paymentStatus)}
            <p className="text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {order.date}
            </p>
          </div>
        </div>

        {/* Document Action Buttons - PROMINENT AND DIRECT */}
        <div className="flex flex-wrap gap-2">
          <Card className="p-4 border-2 border-blue-200 bg-blue-50">
            <div className="text-center mb-2 font-semibold">Documents</div>
            <div className="flex gap-2">
              <Button onClick={() => setInvoiceDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="mr-2 h-4 w-4" />
                Invoice
              </Button>
              <Button onClick={() => setPackingSlipDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                <Package className="mr-2 h-4 w-4" />
                Packing Slip
              </Button>
            </div>
          </Card>

          <Button
            variant="outline"
            onClick={sendOrderConfirmation}
            disabled={order.status === "cancelled" || order.status === "archived"}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Confirmation
          </Button>

          <Button
            onClick={markAsShipped}
            disabled={
              order.status === "shipped" ||
              order.status === "completed" ||
              order.status === "archived" ||
              order.paymentStatus === "pending" ||
              order.paymentStatus === "failed"
            }
          >
            <Truck className="mr-2 h-4 w-4" />
            Mark as Shipped
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setConfirmAction({ action: "cancel" })
                  setConfirmDialogOpen(true)
                }}
                disabled={order.status === "cancelled" || order.status === "completed" || order.status === "archived"}
                className={
                  order.status === "cancelled" || order.status === "completed" || order.status === "archived"
                    ? "text-muted-foreground"
                    : "text-red-600"
                }
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setConfirmAction({ action: "refund" })
                  setConfirmDialogOpen(true)
                }}
                disabled={order.paymentStatus !== "paid" || order.status === "archived"}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refund Payment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={archiveOrder} disabled={order.status === "archived"}>
                <Archive className="mr-2 h-4 w-4" />
                Archive Order
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setConfirmAction({ action: "delete" })
                  setConfirmDialogOpen(true)
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Order Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {/* Order Summary and Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Summary</span>
                  <Badge variant="outline" className="ml-2">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </Badge>
                </CardTitle>
                <CardDescription>Overview of the order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="flex items-center mt-1">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Total</p>
                    <p className="flex items-center mt-1 font-semibold">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Order Status</p>
                  <Select value={order.status} onValueChange={updateOrderStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Payment Status</p>
                  <Select value={order.paymentStatus} onValueChange={updatePaymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Details about the shipping address and method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode.shipping ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shipping Carrier</p>
                      <Input
                        type="text"
                        value={formData.shipping.carrier}
                        onChange={(e) => handleInputChange("shipping", "carrier", e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
                      <Input
                        type="text"
                        value={formData.shipping.trackingNumber}
                        onChange={(e) => handleInputChange("shipping", "trackingNumber", e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Delivery</p>
                      <Input
                        type="date"
                        value={formData.shipping.estimatedDelivery}
                        onChange={(e) => handleInputChange("shipping", "estimatedDelivery", e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shipping Method</p>
                      <Select
                        value={formData.shipping.shippingMethod}
                        onChange={(value) => handleInputChange("shipping", "shippingMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                          <SelectItem value="Express Shipping">Express Shipping</SelectItem>
                          <SelectItem value="Overnight Shipping">Overnight Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditMode({ ...editMode, shipping: false })}>
                        Cancel
                      </Button>
                      <Button onClick={() => saveChanges("shipping")} disabled={saving}>
                        {saving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p>
                        {order.shipping?.address}, {order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}
                      </p>
                      <p>{order.shipping?.country}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shipping Method</p>
                      <p>{order.shipping?.shippingMethod}</p>
                    </div>
                    {order.shipping?.carrier && order.shipping?.trackingNumber && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tracking</p>
                        <Link
                          href={getTrackingUrl(order.shipping.carrier, order.shipping.trackingNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:underline"
                        >
                          {order.shipping.carrier} - {order.shipping.trackingNumber}
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setEditMode({ ...editMode, shipping: true })}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Shipping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Details about the payment method and transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode.payment ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                      <Input
                        type="text"
                        value={formData.payment.transactionId}
                        onChange={(e) => handleInputChange("payment", "transactionId", e.target.value)}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date Paid</p>
                      <Input
                        type="date"
                        value={formData.payment.datePaid}
                        onChange={(e) => handleInputChange("payment", "datePaid", e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditMode({ ...editMode, payment: false })}>
                        Cancel
                      </Button>
                      <Button onClick={() => saveChanges("payment")} disabled={saving}>
                        {saving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                      <p>{order.payment?.method}</p>
                    </div>
                    {order.payment?.cardLast4 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Card</p>
                        <p>**** **** **** {order.payment.cardLast4}</p>
                      </div>
                    )}
                    {order.payment?.transactionId && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                        <p>{order.payment.transactionId}</p>
                      </div>
                    )}
                    {order.payment?.datePaid && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date Paid</p>
                        <p>{order.payment.datePaid}</p>
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setEditMode({ ...editMode, payment: true })}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>List of items included in the order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {item.image && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <ShoppingBag className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span>{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.sku || "N/A"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <div className="grid gap-2 text-right">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Subtotal:</p>
                  <p className="font-semibold">
                    $
                    {(order.subtotal || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(
                      2,
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Shipping:</p>
                  <p className="font-semibold">${(order.shipping?.shippingCost || 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Tax:</p>
                  <p className="font-semibold">${(order.tax || 0).toFixed(2)}</p>
                </div>
                {order.discount && (
                  <div className="flex items-center justify-between text-green-500">
                    <p className="text-sm font-medium text-muted-foreground">
                      Discount
                      {order.discountCode && ` (${order.discountCode})`}:
                    </p>
                    <p className="font-semibold">-${order.discount.toFixed(2)}</p>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Total:</p>
                  <p className="text-xl font-semibold">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Customer Tab */}
        <TabsContent value="customer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Details about the customer who placed the order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode.customer ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <Input
                      type="text"
                      value={formData.customer.name}
                      onChange={(e) => handleInputChange("customer", "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <Input
                      type="email"
                      value={formData.customer.email}
                      onChange={(e) => handleInputChange("customer", "email", e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <Input
                      type="tel"
                      value={formData.customer.phone}
                      onChange={(e) => handleInputChange("customer", "phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <Input
                      type="text"
                      value={formData.customer.company}
                      onChange={(e) => handleInputChange("customer", "company", e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditMode({ ...editMode, customer: false })}>
                      Cancel
                    </Button>
                    <Button onClick={() => saveChanges("customer")} disabled={saving}>
                      {saving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.customerInfo?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.customerInfo?.email}
                    </p>
                  </div>
                  {order.customerInfo?.phone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        {order.customerInfo.phone}
                      </p>
                    </div>
                  )}
                  {order.customerInfo?.company && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company</p>
                      <p className="flex items-center">
                        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                        {order.customerInfo.company}
                      </p>
                    </div>
                  )}
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
                    <p className="flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.customerInfo?.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.customerInfo?.totalOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                    <p className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />$
                      {order.customerInfo?.totalSpent?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Order Date</p>
                    <p className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {order.customerInfo?.firstOrderDate}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditMode({ ...editMode, customer: true })}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Timeline of events related to this order</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <div className="relative">
                  <div className="absolute left-2 top-2 h-full w-[2px] bg-gray-200" />
                  <div className="space-y-4">
                    {order.history?.map((event, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div>
                          <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                            <div className="absolute -left-1 -top-1 h-6 w-6 animate-ping rounded-full bg-blue-400 opacity-75" />
                            <div className="relative h-3 w-3 rounded-full bg-blue-600" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{event.note}</p>
                            <p className="text-xs text-muted-foreground">{event.date}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{event.user && `By ${event.user}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
              <CardDescription>Additional notes or comments about the order</CardDescription>
            </CardHeader>
            <CardContent>
              {editMode.notes ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add notes about the order"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", null, e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditMode({ ...editMode, notes: false })}>
                      Cancel
                    </Button>
                    <Button onClick={() => saveChanges("notes")} disabled={saving}>
                      {saving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {order.notes ? (
                    <p>{order.notes}</p>
                  ) : (
                    <p className="text-muted-foreground">No notes added for this order.</p>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setEditMode({ ...editMode, notes: true })}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

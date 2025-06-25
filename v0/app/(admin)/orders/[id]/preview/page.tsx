"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, FileText, Package, Printer, Eye, CheckCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

import { generateInvoiceHTML, generatePackingSlipHTML, downloadHTMLAsPDF, type OrderData } from "@/lib/pdf-generator"

// Helper function to get orders from localStorage
function getOrdersFromStorage(): OrderData[] {
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

export default function OrderPreviewPage(): JSX.Element {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("invoice")
  const [invoiceHTML, setInvoiceHTML] = useState<string>("")
  const [packingSlipHTML, setPackingSlipHTML] = useState<string>("")

  useEffect(() => {
    const fetchOrder = () => {
      setLoading(true)
      try {
        const orders = getOrdersFromStorage()
        const foundOrder = orders.find((order) => order.id === orderId)

        if (foundOrder) {
          // Ensure all required fields are present
          const completeOrder: OrderData = {
            ...foundOrder,
            subtotal:
              foundOrder.subtotal || foundOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            tax: foundOrder.tax || 0,
            discount: foundOrder.discount || 0,
            shipping: {
              ...foundOrder.shipping,
              shippingCost: foundOrder.shipping?.shippingCost || 0,
            },
          }

          setOrder(completeOrder)

          // Generate HTML content
          const invoiceContent = generateInvoiceHTML(completeOrder)
          const packingContent = generatePackingSlipHTML(completeOrder)

          setInvoiceHTML(invoiceContent)
          setPackingSlipHTML(packingContent)
        } else {
          console.error("Order not found")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handleDownloadInvoice = () => {
    if (invoiceHTML && order) {
      downloadHTMLAsPDF(invoiceHTML, `invoice-${order.id}.html`)
    }
  }

  const handleDownloadPackingSlip = () => {
    if (packingSlipHTML && order) {
      downloadHTMLAsPDF(packingSlipHTML, `packing-slip-${order.id}.html`)
    }
  }

  const handlePrintInvoice = () => {
    if (invoiceHTML) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(invoiceHTML)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    }
  }

  const handlePrintPackingSlip = () => {
    if (packingSlipHTML) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(packingSlipHTML)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href={`/admin/orders/${orderId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[300px]" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>

          <Skeleton className="h-[600px] rounded-lg" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link href={`/admin/orders/${orderId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription>
            The requested order could not be found. Please check the order ID and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/orders/${orderId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Document Preview</h1>
            <p className="text-muted-foreground">Order {order.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === "invoice" ? (
            <>
              <Button onClick={handlePrintInvoice} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
              <Button onClick={handleDownloadInvoice}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handlePrintPackingSlip} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Packing Slip
              </Button>
              <Button onClick={handleDownloadPackingSlip}>
                <Download className="mr-2 h-4 w-4" />
                Download Packing Slip
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Order Summary
          </CardTitle>
          <CardDescription>Preview and download documents for order {order.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer</p>
              <p className="font-medium">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="font-medium">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {order.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoice Preview
          </TabsTrigger>
          <TabsTrigger value="packing" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Packing Slip Preview
          </TabsTrigger>
        </TabsList>

        {/* Invoice Preview */}
        <TabsContent value="invoice">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Invoice Preview
                </CardTitle>
                <CardDescription>Preview of the invoice document for order {order.id}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePrintInvoice} variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleDownloadInvoice} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="w-full h-[800px] overflow-auto" dangerouslySetInnerHTML={{ __html: invoiceHTML }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packing Slip Preview */}
        <TabsContent value="packing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-purple-600" />
                  Packing Slip Preview
                </CardTitle>
                <CardDescription>Preview of the packing slip document for order {order.id}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePrintPackingSlip} variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button onClick={handleDownloadPackingSlip} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="w-full h-[800px] overflow-auto" dangerouslySetInnerHTML={{ __html: packingSlipHTML }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Invoice Actions
            </CardTitle>
            <CardDescription>Generate and download the invoice for this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Professional invoice format
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Complete order and payment details
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Ready for customer delivery
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button onClick={handlePrintInvoice} variant="outline" className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleDownloadInvoice} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Packing Slip Actions
            </CardTitle>
            <CardDescription>Generate and download the packing slip for this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Detailed packing instructions
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Quality control checklist
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Shipping information included
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button onClick={handlePrintPackingSlip} variant="outline" className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button onClick={handleDownloadPackingSlip} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

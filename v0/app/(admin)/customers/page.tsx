"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, MoreHorizontal, Search } from "lucide-react"

// Mock customer data
const customers = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    amountSpent: 1249.99,
    status: "active",
    lastPurchase: "2023-05-12",
    productsPurchased: ["Air Purifier Pro", "HEPA Filter Pack"],
  },
  {
    id: "CUST-002",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    amountSpent: 3567.5,
    status: "active",
    lastPurchase: "2023-05-15",
    productsPurchased: ["Fresh Air Machine", "Air Sanitizer", "Air Mask"],
  },
  {
    id: "CUST-003",
    name: "Michael Williams",
    email: "michael.williams@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine St, Chicago, IL 60007",
    amountSpent: 899.95,
    status: "inactive",
    lastPurchase: "2023-03-22",
    productsPurchased: ["Air Mask", "Replacement Filters"],
  },
  {
    id: "CUST-004",
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    phone: "(555) 456-7890",
    address: "101 Maple Dr, Houston, TX 77001",
    amountSpent: 2199.99,
    status: "active",
    lastPurchase: "2023-05-18",
    productsPurchased: ["Fresh Air Machine", "Annual Maintenance Plan"],
  },
  {
    id: "CUST-005",
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "(555) 567-8901",
    address: "202 Cedar Ln, Phoenix, AZ 85001",
    amountSpent: 459.95,
    status: "active",
    lastPurchase: "2023-05-10",
    productsPurchased: ["Air Sanitizer", "Sanitizer Refill Pack"],
  },
  {
    id: "CUST-006",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "(555) 678-9012",
    address: "303 Birch Rd, Philadelphia, PA 19019",
    amountSpent: 3299.97,
    status: "active",
    lastPurchase: "2023-05-14",
    productsPurchased: ["Fresh Air Machine", "Air Purifier Pro", "Premium Filter Set"],
  },
  {
    id: "CUST-007",
    name: "Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "(555) 789-0123",
    address: "404 Elm St, San Antonio, TX 78006",
    amountSpent: 149.99,
    status: "inactive",
    lastPurchase: "2023-02-28",
    productsPurchased: ["Air Mask"],
  },
  {
    id: "CUST-008",
    name: "Jennifer Anderson",
    email: "jennifer.anderson@example.com",
    phone: "(555) 890-1234",
    address: "505 Walnut Ave, San Diego, CA 92101",
    amountSpent: 2749.95,
    status: "active",
    lastPurchase: "2023-05-16",
    productsPurchased: ["Fresh Air Machine", "Extended Warranty", "Filter Subscription"],
  },
  {
    id: "CUST-009",
    name: "Thomas Jackson",
    email: "thomas.jackson@example.com",
    phone: "(555) 901-2345",
    address: "606 Spruce Blvd, Dallas, TX 75001",
    amountSpent: 599.99,
    status: "active",
    lastPurchase: "2023-05-11",
    productsPurchased: ["Air Sanitizer", "Premium Package"],
  },
  {
    id: "CUST-010",
    name: "Lisa White",
    email: "lisa.white@example.com",
    phone: "(555) 012-3456",
    address: "707 Aspen Ct, San Jose, CA 95101",
    amountSpent: 1899.97,
    status: "active",
    lastPurchase: "2023-05-17",
    productsPurchased: ["Air Purifier Pro", "Annual Filter Pack", "UV Sanitizer"],
  },
  {
    id: "CUST-011",
    name: "Daniel Harris",
    email: "daniel.harris@example.com",
    phone: "(555) 123-4567",
    address: "808 Redwood Dr, Austin, TX 78701",
    amountSpent: 349.95,
    status: "inactive",
    lastPurchase: "2023-04-05",
    productsPurchased: ["Air Mask", "Replacement Filters"],
  },
  {
    id: "CUST-012",
    name: "Michelle Martin",
    email: "michelle.martin@example.com",
    phone: "(555) 234-5678",
    address: "909 Sequoia Ln, Jacksonville, FL 32099",
    amountSpent: 2499.99,
    status: "active",
    lastPurchase: "2023-05-13",
    productsPurchased: ["Fresh Air Machine", "Premium Installation"],
  },
  {
    id: "CUST-013",
    name: "Christopher Thompson",
    email: "christopher.thompson@example.com",
    phone: "(555) 345-6789",
    address: "110 Willow St, Indianapolis, IN 46201",
    amountSpent: 799.95,
    status: "active",
    lastPurchase: "2023-05-09",
    productsPurchased: ["Air Sanitizer", "Annual Supply Pack"],
  },
  {
    id: "CUST-014",
    name: "Amanda Garcia",
    email: "amanda.garcia@example.com",
    phone: "(555) 456-7890",
    address: "211 Cypress Ave, Columbus, OH 43085",
    amountSpent: 3799.97,
    status: "active",
    lastPurchase: "2023-05-19",
    productsPurchased: ["Fresh Air Machine", "Air Purifier Pro", "Whole Home Package"],
  },
  {
    id: "CUST-015",
    name: "James Martinez",
    email: "james.martinez@example.com",
    phone: "(555) 567-8901",
    address: "312 Magnolia Blvd, Charlotte, NC 28202",
    amountSpent: 199.99,
    status: "inactive",
    lastPurchase: "2023-03-15",
    productsPurchased: ["Air Mask", "Travel Case"],
  },
  {
    id: "CUST-016",
    name: "Elizabeth Robinson",
    email: "elizabeth.robinson@example.com",
    phone: "(555) 678-9012",
    address: "413 Juniper Rd, Seattle, WA 98101",
    amountSpent: 2899.95,
    status: "active",
    lastPurchase: "2023-05-15",
    productsPurchased: ["Fresh Air Machine", "Smart Home Integration", "Premium Filters"],
  },
  {
    id: "CUST-017",
    name: "Kevin Clark",
    email: "kevin.clark@example.com",
    phone: "(555) 789-0123",
    address: "514 Sycamore St, Denver, CO 80014",
    amountSpent: 699.99,
    status: "active",
    lastPurchase: "2023-05-12",
    productsPurchased: ["Air Sanitizer", "Commercial Grade Package"],
  },
  {
    id: "CUST-018",
    name: "Patricia Rodriguez",
    email: "patricia.rodriguez@example.com",
    phone: "(555) 890-1234",
    address: "615 Poplar Dr, Boston, MA 02108",
    amountSpent: 1999.97,
    status: "active",
    lastPurchase: "2023-05-16",
    productsPurchased: ["Air Purifier Pro", "Allergy Relief Package", "Annual Maintenance"],
  },
  {
    id: "CUST-019",
    name: "George Lewis",
    email: "george.lewis@example.com",
    phone: "(555) 901-2345",
    address: "716 Chestnut Ln, Nashville, TN 37203",
    amountSpent: 399.95,
    status: "inactive",
    lastPurchase: "2023-04-20",
    productsPurchased: ["Air Mask", "Premium Filters"],
  },
  {
    id: "CUST-020",
    name: "Nancy Lee",
    email: "nancy.lee@example.com",
    phone: "(555) 012-3456",
    address: "817 Hickory Ct, Portland, OR 97201",
    amountSpent: 2599.99,
    status: "active",
    lastPurchase: "2023-05-18",
    productsPurchased: ["Fresh Air Machine", "Extended Warranty", "Premium Installation"],
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to download customer data as CSV
  const downloadCSV = () => {
    // CSV header
    const csvHeader = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Address",
      "Amount Spent",
      "Status",
      "Last Purchase",
      "Products Purchased",
    ].join(",")

    // Convert customer data to CSV rows
    const csvRows = customers.map((customer) => {
      return [
        customer.id,
        `"${customer.name}"`,
        `"${customer.email}"`,
        `"${customer.phone}"`,
        `"${customer.address}"`,
        customer.amountSpent,
        customer.status,
        customer.lastPurchase,
        `"${customer.productsPurchased.join("; ")}"`,
      ].join(",")
    })

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join("\n")

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "customer_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage your customer database</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8 w-[200px] sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Customers</DropdownMenuItem>
                  <DropdownMenuItem>Active Customers</DropdownMenuItem>
                  <DropdownMenuItem>Inactive Customers</DropdownMenuItem>
                  <DropdownMenuItem>High Value ({">"}$1000)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Last Purchase</TableHead>
                  <TableHead className="text-right">Amount Spent</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.email}</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{customer.lastPurchase}</TableCell>
                    <TableCell className="text-right font-medium">${customer.amountSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuItem>Order History</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

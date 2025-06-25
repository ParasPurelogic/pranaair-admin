"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Sample data for charts
const monthlySales = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
  { name: "Jul", sales: 7000 },
  { name: "Aug", sales: 6500 },
  { name: "Sep", sales: 8000 },
  { name: "Oct", sales: 7500 },
  { name: "Nov", sales: 9000 },
  { name: "Dec", sales: 10000 },
]

const productPerformance = [
  { name: "Air Purifier Pro", value: 45 },
  { name: "HEPA Filter", value: 25 },
  { name: "Air Quality Monitor", value: 15 },
  { name: "Portable Purifier", value: 10 },
  { name: "Filter Pack", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const customerGrowth = [
  { month: "Jan", customers: 100 },
  { month: "Feb", customers: 120 },
  { month: "Mar", customers: 150 },
  { month: "Apr", customers: 180 },
  { month: "May", customers: 220 },
  { month: "Jun", customers: 270 },
  { month: "Jul", customers: 330 },
  { month: "Aug", customers: 400 },
  { month: "Sep", customers: 480 },
  { month: "Oct", customers: 550 },
  { month: "Nov", customers: 630 },
  { month: "Dec", customers: 720 },
]

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <Tabs defaultValue="sales">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Performance</CardTitle>
              <CardDescription>Overview of sales performance over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="var(--color-sales)" name="Sales ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Distribution of sales by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>Monthly customer acquisition over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  customers: {
                    label: "Customers",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="customers"
                      stroke="var(--color-customers)"
                      activeDot={{ r: 8 }}
                      name="Total Customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

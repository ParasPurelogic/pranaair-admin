"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Plus, Search } from "lucide-react"
import Image from "next/image"

// Sample product data
const initialProducts = [
  {
    id: 1,
    name: "Air Quality Monitor",
    sku: "AQM-001",
    category: "Air Monitors",
    price: 149.99,
    stock: 25,
    stockStatus: "In Stock",
    image: "/placeholder-w6wmb.png",
  },
  {
    id: 2,
    name: "Wearable Air Purifier",
    sku: "WAP-002",
    category: "Air Purifiers",
    price: 99.99,
    stock: 42,
    stockStatus: "In Stock",
    image: "/placeholder-6h5cp.png",
  },
  {
    id: 3,
    name: "Air Mask",
    sku: "AM-003",
    category: "Air Masks",
    price: 29.99,
    stock: 78,
    stockStatus: "In Stock",
    image: "/air-mask.png",
  },
  {
    id: 4,
    name: "Air Sanitizer",
    sku: "AS-004",
    category: "Air Sanitizers",
    price: 199.99,
    stock: 15,
    stockStatus: "In Stock",
    image: "/air-sanitizer.png",
  },
  {
    id: 5,
    name: "Fresh Air Machine",
    sku: "FAM-005",
    category: "Fresh Air Machines",
    price: 299.99,
    stock: 8,
    stockStatus: "In Stock",
    image: "/fresh-air-machine.png",
  },
]

// Extract unique categories for filter
const categories = ["All Categories", ...new Set(initialProducts.map((product) => product.category))]
const stockStatuses = ["All Stock Status", "In Stock", "Low Stock", "Out of Stock"]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStockStatus, setSelectedStockStatus] = useState("All Stock Status")

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    stockStatus: "In Stock",
    description: "",
    image: "/placeholder.svg?height=60&width=60&query=product",
  })

  // Filter products based on search query, category, and stock status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
    const matchesStockStatus = selectedStockStatus === "All Stock Status" || product.stockStatus === selectedStockStatus

    return matchesSearch && matchesCategory && matchesStockStatus
  })

  // Enhanced handleAddProduct with validation
  const handleAddProduct = () => {
    // Validation
    if (!newProduct.name.trim()) {
      alert("Please enter a product name")
      return
    }
    if (!newProduct.sku.trim()) {
      alert("Please enter a SKU")
      return
    }
    if (!newProduct.category) {
      alert("Please select a category")
      return
    }
    if (!newProduct.price || Number.parseFloat(newProduct.price) <= 0) {
      alert("Please enter a valid price")
      return
    }
    if (!newProduct.stock || Number.parseInt(newProduct.stock) < 0) {
      alert("Please enter a valid stock quantity")
      return
    }

    // Check for duplicate SKU
    if (products.some((product) => product.sku === newProduct.sku)) {
      alert("SKU already exists. Please use a different SKU.")
      return
    }

    const productToAdd = {
      ...newProduct,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock),
    }

    setProducts([...products, productToAdd])
    setNewProduct({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
      stockStatus: "In Stock",
      description: "",
      image: "/placeholder.svg?height=60&width=60&query=product",
    })
    setIsAddModalOpen(false)
    alert("Product added successfully!")
  }

  // Enhanced handleEditProduct with validation
  const handleEditProduct = () => {
    // Validation
    if (!currentProduct.name.trim()) {
      alert("Please enter a product name")
      return
    }
    if (!currentProduct.sku.trim()) {
      alert("Please enter a SKU")
      return
    }
    if (!currentProduct.category) {
      alert("Please select a category")
      return
    }
    if (!currentProduct.price || currentProduct.price <= 0) {
      alert("Please enter a valid price")
      return
    }
    if (currentProduct.stock < 0) {
      alert("Please enter a valid stock quantity")
      return
    }

    // Check for duplicate SKU (excluding current product)
    if (products.some((product) => product.sku === currentProduct.sku && product.id !== currentProduct.id)) {
      alert("SKU already exists. Please use a different SKU.")
      return
    }

    const updatedProducts = products.map((product) => (product.id === currentProduct.id ? currentProduct : product))
    setProducts(updatedProducts)
    setIsEditModalOpen(false)
    alert("Product updated successfully!")
  }

  // Handle deleting a product
  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)
  }

  // Open edit modal with product data
  const openEditModal = (product) => {
    setCurrentProduct(product)
    setIsEditModalOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-500">Manage your products</p>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} />
              Add Product
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="w-[200px]">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
            >
              {stockStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[200px]">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="py-4 px-6 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="py-4 px-6">
                    <div className="w-[60px] h-[60px] relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{product.sku}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{product.category}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">₹{product.price.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 20
                          ? "bg-green-100 text-green-800"
                          : product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-gray-600 hover:text-gray-900" onClick={() => openEditModal(product)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-900">Add New Product</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Fill in the details below to add a new product to your inventory
            </p>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="product-name" className="text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <Input
                  id="product-name"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sku" className="text-sm font-medium text-gray-700">
                  SKU *
                </label>
                <Input
                  id="sku"
                  placeholder="Enter SKU"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories
                  .filter((cat) => cat !== "All Categories")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Price (₹) *
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="product-image" className="text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Input id="product-image" type="file" accept="image/*" className="hidden" />
                <label htmlFor="product-image" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and
                      drop
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="stock-status" className="text-sm font-medium text-gray-700">
                Stock Status
              </label>
              <select
                id="stock-status"
                value={newProduct.stockStatus}
                onChange={(e) => setNewProduct({ ...newProduct, stockStatus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="px-6">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleAddProduct} className="px-6 bg-blue-600 hover:bg-blue-700 text-white">
              Add Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-900">Edit Product</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Update the product details below</p>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-product-name" className="text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <Input
                    id="edit-product-name"
                    placeholder="Enter product name"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-sku" className="text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <Input
                    id="edit-sku"
                    placeholder="Enter SKU"
                    value={currentProduct.sku}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="edit-category"
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories
                    .filter((cat) => cat !== "All Categories")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-price" className="text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <Input
                    id="edit-price"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) })}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-stock" className="text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <Input
                    id="edit-stock"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={currentProduct.stock}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) })}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-product-image" className="text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={currentProduct.image || "/placeholder.svg"}
                        alt={currentProduct.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Current image</p>
                      <Input id="edit-product-image" type="file" accept="image/*" className="text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-stock-status" className="text-sm font-medium text-gray-700">
                  Stock Status
                </label>
                <select
                  id="edit-stock-status"
                  value={currentProduct.stockStatus}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, stockStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={4}
                  placeholder="Enter product description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  value={currentProduct.description || ""}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="px-6">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleEditProduct} className="px-6 bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

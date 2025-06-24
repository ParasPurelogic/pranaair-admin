"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "../utils/i18n"

export function MegaMenu({ categories, onClose, isMobile = false }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.slug || "")
  const [activeSubcategory, setActiveSubcategory] = useState(categories[0]?.subcategories?.[0]?.slug || "")

  const { t } = useTranslations()

  const selectedCategory = categories.find((cat) => cat.slug === activeCategory)
  const selectedSubcategory = selectedCategory?.subcategories?.find((sub) => sub.slug === activeSubcategory)

  return (
    <div className="w-full bg-white">
      <div className="flex min-h-[400px] w-full">
        {/* Categories Sidebar */}
        <div className="w-[280px] bg-[#7ab261] p-0">
          {categories.map((category) => (
            <button
              key={category.slug}
              className={`flex w-full items-center gap-3 border-none px-4 py-3 text-left text-white hover:bg-[#689152] ${
                activeCategory === category.slug ? "bg-[#689152] text-white font-medium" : "text-white font-normal"
              }`}
              onMouseEnter={() => {
                setActiveCategory(category.slug)
                setActiveSubcategory(category.subcategories?.[0]?.slug || "")
              }}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                <Image
                  src={category.icon || "/placeholder.svg?height=24&width=24"}
                  alt=""
                  width={24}
                  height={24}
                  className="brightness-0 invert"
                />
              </span>
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRight
                  className={`ml-auto h-4 w-4 transition-transform ${
                    activeCategory === category.slug ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Subcategories Sidebar */}
        {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
          <div className="w-[220px] border-r border-gray-200 bg-white py-4">
            {selectedCategory.subcategories.map((subcategory) => (
              <button
                key={subcategory.slug}
                className={`flex w-full items-center gap-2 border-none bg-none px-4 py-2 text-left transition-all hover:bg-gray-50 hover:text-[#7ab261] ${
                  activeSubcategory === subcategory.slug
                    ? "bg-gray-50 text-[#7ab261] font-medium"
                    : "text-gray-700 font-normal"
                }`}
                onMouseEnter={() => setActiveSubcategory(subcategory.slug)}
              >
                {subcategory.icon && (
                  <Image
                    src={subcategory.icon || "/placeholder.svg?height=20&width=20"}
                    alt=""
                    width={20}
                    height={20}
                    className="opacity-75"
                  />
                )}
                {subcategory.name}
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 bg-white p-4">
          {selectedSubcategory?.products && selectedSubcategory.products.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-medium text-gray-900">{selectedSubcategory.name}</h3>
                <Link
                  href={`/${selectedCategory?.slug}/${selectedSubcategory.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-[#7ab261] hover:text-[#689152] transition-colors"
                  onClick={onClose}
                >
                  View All {selectedSubcategory.name}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {selectedSubcategory.products.map((product) => (
                  <Link
                    key={product.slug}
                    href={product.url || `/product/${product.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200"
                    onClick={onClose}
                  >
                    <div className="relative aspect-[3/2] w-full bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg?height=200&width=300"}
                        alt={product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-col p-2 z-10">
                      <h3 className="text-sm font-medium text-gray-900 text-center">{product.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedCategory?.name}</h3>
                <p className="text-gray-500 mb-4">View all {selectedCategory?.name} products</p>
                <Link
                  href={`/${selectedCategory?.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#7ab261] text-white rounded-md hover:bg-[#689152] transition-colors"
                  onClick={onClose}
                >
                  Browse Products
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client";

import { FNGetAllProducts, FNGetProductCategories } from "@/fetchers/types";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/elements/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, Plus, Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { TableColumn } from "react-data-table-component";
import dynamic from "next/dynamic";
import ShowLoader from "@/components/ShowLoader";

// StockFilter
const stockFilter = [
  {
    id: "all",
    name: "All Stock Status",
  },
  {
    id: "in",
    name: "In Stock",
  },
  {
    id: "low",
    name: "Low Stock",
  },
  {
    id: "out",
    name: "Out of Stock",
  },
];

const lowStockThreshold = 5;

// ProductModal
const ProductModal = dynamic(() => import("./ProductModal"), {
  ssr: false,
  loading: () => <ShowLoader fullScreen />,
});

export default function PageProducts({
  products,
  productCategories,
}: {
  products: FNGetAllProducts;
  productCategories: FNGetProductCategories;
}) {
  // States
  const [flags, setFlags] = useState({
    searchedTerm: "",
    selectedCategory: {
      id: 0,
      name: "All Categories",
    } as FNGetProductCategories[number],
    selectedStockStatus: stockFilter[0],
    showProductModal: false as boolean | FNGetAllProducts[number],
    products: products,
  });

  // Columns
  const columns: TableColumn<FNGetAllProducts[number]>[] = useMemo(
    () => {
      return [
        // Image
        {
          name: "Image",
          cell: (row) => (
            <div
              className="bg-gray-100 aspect-square rounded-[0.5rem] w-[5rem]"
              style={{
                backgroundImage: `url(${row?.images?.[0]})`,
              }}
            ></div>
          ),
          minWidth: "10rem",
        },
        // Name
        {
          name: "Name",
          selector: (row) => row?.title || "",
          cell: (row) => <p className="text-title">{row.title}</p>,
          sortable: true,
          minWidth: "10rem",
        },
        // SKU
        {
          name: "SKU",
          selector: (row) => row?.sku || "",
          sortable: true,
          minWidth: "10rem",
        },
        // Category
        {
          name: "Category",
          selector: (row) => row?.category || "",
          cell: (row) => <p className="capitalize">{row.category}</p>,
          sortable: true,
          minWidth: "10rem",
          center: true,
        },
        // Price
        {
          name: "Price",
          selector: (row) => row?.price || "",
          sortable: true,
          minWidth: "10rem",
          center: true,
        },
        // Stock
        {
          name: "Stock",
          selector: (row) => row?.stock || "",
          cell: (row) => (
            <Badge
              className={
                !row.stock
                  ? "bg-red-100 text-red-800"
                  : row.stock! <= lowStockThreshold
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {row?.stock} in stock
            </Badge>
          ),
          sortable: true,
          minWidth: "10rem",
          center: true,
        },
        // Action
        {
          name: "Action",
          sortable: true,
          minWidth: "10rem",
          selector: (row) => row?.price || "",
          cell: (row) => (
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setFlags({ ...flags, showProductModal: row })}
                className="text-amber-600 bg-amber-600/10"
              >
                <Edit />
              </Button>
              <Button disabled className="text-error bg-error/10">
                <Trash />
              </Button>
            </div>
          ),
        },
      ];
    },
    // eslint-disable-next-line
    []
  );

  // Render
  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full flex justify-between items-center gap-4 flex-wrap border-b py-5 -mt-body mb-[var(--padding)]">
        {/* Heading */}
        <h1 className="font-bold">Manage Products</h1>

        {/* Add Button */}
        <Button onClick={() => setFlags({ ...flags, showProductModal: true })}>
          <Plus />
          Add Product
        </Button>

        {/* Filters */}
        <div className="w-full flex flex-wrap gap-4">
          {/* Filter By Stock */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="bg-transparent text-para !border-para/20 h-fit"
              >
                {flags.selectedStockStatus.name}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {stockFilter.map((o) => (
                <DropdownMenuItem
                  key={o.id}
                  onSelect={() =>
                    setFlags((prev) => ({ ...prev, selectedStockStatus: o }))
                  }
                >
                  {o.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter By Category */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="bg-transparent text-para !border-para/20 h-fit"
              >
                {flags.selectedCategory.name}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[
                {
                  id: 0,
                  name: "All Categories",
                },
                ...productCategories,
              ].map((o) => (
                <DropdownMenuItem
                  key={o.id}
                  onSelect={() =>
                    setFlags((prev) => ({ ...prev, selectedCategory: o }))
                  }
                >
                  {o.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <SearchBar
            className="w-fit ml-auto"
            onClear={() => setFlags((prev) => ({ ...prev, searchedTerm: "" }))}
            onSearch={(term) =>
              setFlags((prev) => ({ ...prev, searchedTerm: term }))
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full grow flex flex-col">
        <DataTable
          columns={columns}
          data={(() => {
            // Let data
            let productsList = flags?.products;

            // Filter by search term
            if (flags.searchedTerm) {
              const query = flags.searchedTerm?.toLowerCase();
              productsList = productsList.filter((p) =>
                `${p?.category} ${p?.description} ${p?.title} ${p?.sku} ${p?.stock} ${p?.price}`
                  ?.toLowerCase()
                  ?.includes(query)
              );
            }

            // Filter by category
            if (flags?.selectedCategory?.id != 0) {
              productsList = productsList.filter(
                (p) =>
                  p?.category?.toLowerCase() ==
                  flags?.selectedCategory?.name?.toLowerCase()
              );
            }

            // Filter by stock availability
            if (flags?.selectedStockStatus?.id != "all") {
              // if out
              if (flags?.selectedStockStatus?.id == "out") {
                productsList = productsList.filter((p) => !p?.stock);
              }
              // if low
              else if (flags?.selectedStockStatus?.id == "low") {
                productsList = productsList.filter(
                  (p) => (p?.stock ?? 0) <= lowStockThreshold
                );
              }
              // if in stock
              else if (flags?.selectedStockStatus?.id == "in") {
                productsList = productsList.filter((p) => (p?.stock ?? 0) > 0);
              }
            }

            // return
            return productsList;
          })()}
        />
      </div>

      {/* ProductModal */}
      {flags.showProductModal && (
        <ProductModal
          onClose={() =>
            setFlags((prev) => ({ ...prev, showProductModal: false }))
          }
          product={
            typeof flags.showProductModal === "object"
              ? flags.showProductModal
              : undefined
          }
          onSuccess={(product) => {
            setFlags((prev) => ({
              ...prev,
              products:
                typeof flags.showProductModal == "object"
                  ? prev.products.map((p) =>
                      p._id == product._id ? product : p
                    )
                  : [...prev.products, product],
              showProductModal: false,
            }));
          }}
        />
      )}
    </div>
  );
}

// function filter

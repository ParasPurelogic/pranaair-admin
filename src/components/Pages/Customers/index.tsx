"use client";

import { FNGetAllCustomers } from "@/fetchers/types";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/elements/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  Download,
  FilterIcon,
  Mail,
  Phone,
} from "lucide-react";
import { useMemo, useState } from "react";
import { TableColumn } from "react-data-table-component";

// Filters
const filters = [
  {
    id: "all",
    name: "All",
  },
  {
    id: "active",
    name: "Active",
  },
  {
    id: "inactive",
    name: "Inactive",
  },
];

export default function PageCustomers({ data }: { data: FNGetAllCustomers }) {
  // States
  const [flags, setFlags] = useState({
    selectedFilter: filters[0],
    searchedTerm: "",
  });

  // Columns
  const columns: TableColumn<FNGetAllCustomers[number]>[] = useMemo(() => {
    return [
      // Name
      {
        name: "Customer",
        sortable: true,
        selector: (row) => row?.first_name || "",
        cell: (row) => (
          <div className="flex flex-col gap-[0.3rem]">
            <div className="font-medium">{row.first_name}</div>
            <div className="text-[0.7em] break-words">{row._id}</div>
          </div>
        ),
        minWidth: "10rem",
      },
      // Contact
      {
        name: "Contact",
        sortable: true,
        selector: (row) => row?.first_name || "",
        cell: (row) => (
          <div className="flex flex-col gap-[0.3em]">
            <div className="flex gap-[0.3rem]">
              <Mail className="w-[1em]" />
              <div className="font-medium">{row.email}</div>
            </div>
            <div className="flex gap-[0.3rem]">
              <Phone className="w-[1em]" />
              <div>{row.phone_number}</div>
            </div>
          </div>
        ),
        minWidth: "15rem",
      },
      // Account Status
      {
        name: "Status",
        sortable: true,
        selector: (row) => row?.is_email_verified || "",
        cell: (row) => (
          <Badge
            variant="secondary"
            className={
              row.is_email_verified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            <BadgeCheckIcon />
            {row.is_email_verified ? "Active" : "Inactive"}
          </Badge>
        ),
        minWidth: "10rem",
      },
      // Joined Date
      {
        name: "Joined Date",
        sortable: true,
        selector: (row) =>
          row?.createdAt
            ? new Date(row.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "",
        minWidth: "10rem",
      },
    ];
  }, []);

  // Render
  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full flex justify-between items-center gap-4 flex-wrap border-b py-5 -mt-body mb-[var(--padding)]">
        {/* Heading */}
        <h1 className="font-bold">Customers</h1>

        {/* CSV */}
        <Button variant={"outline"}>
          <Download className="w-9" />
          Export CSV
        </Button>

        {/* Filters */}
        <div className="w-full flex gap-4">
          {/* Search */}
          <SearchBar
            onClear={() => setFlags((prev) => ({ ...prev, searchedTerm: "" }))}
            onSearch={(term) =>
              setFlags((prev) => ({ ...prev, searchedTerm: term }))
            }
          />

          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="bg-transparent text-para !border-para/20 h-fit"
              >
                {flags.selectedFilter.name}
                <FilterIcon className="w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filters.map((o) => (
                <DropdownMenuItem
                  key={o.id}
                  onSelect={() =>
                    setFlags((prev) => ({ ...prev, selectedFilter: o }))
                  }
                >
                  {o.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="w-full grow flex flex-col">
        <DataTable
          columns={columns}
          data={(() => {
            // Let data
            let customers = data;

            // Filter by search term
            if (flags.searchedTerm) {
              const query = flags.searchedTerm?.toLowerCase();
              customers = customers.filter((c) =>
                `${c.first_name} ${c.last_name} ${c.email} ${c.phone_number}`
                  ?.toLowerCase()
                  ?.includes(query)
              );
            }

            // Filter by selected filter
            if (flags.selectedFilter.id === "active") {
              customers = customers.filter((c) => c.is_email_verified);
            } else if (flags.selectedFilter.id === "inactive") {
              customers = customers.filter((c) => !c.is_email_verified);
            }

            // return
            return customers;
          })()}
        />
      </div>
    </div>
  );
}

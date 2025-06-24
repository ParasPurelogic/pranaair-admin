"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isFilter?: boolean
  filterActive?: boolean
  onFilterChange?: (active: boolean) => void
  isDateRangeTrigger?: boolean
  startDate?: Date | null
  endDate?: Date | null
  onCalendarToggle?: () => void
  isDateRange?: boolean
  dateRangeValue?: string
  onDateRangeClick?: () => void
  hasDateSelection?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isFilter = false,
      filterActive = false,
      onFilterChange,
      isDateRangeTrigger = false,
      startDate = null,
      endDate = null,
      onCalendarToggle,
      onClick,
      isDateRange = false,
      dateRangeValue,
      onDateRangeClick,
      hasDateSelection = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isFilter && onFilterChange) {
        onFilterChange(!filterActive)
      }
      if (isDateRangeTrigger && onCalendarToggle) {
        onCalendarToggle()
      }
      if (isDateRange && onDateRangeClick) {
        onDateRangeClick()
      }
      onClick?.(e)
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          isFilter && "relative",
          isFilter && filterActive && "ring-2 ring-primary",
          isDateRangeTrigger && "justify-start text-left font-normal relative",
          isDateRangeTrigger && (startDate || endDate) && "ring-1 ring-primary text-primary",
          isDateRange && "justify-start text-left font-normal min-w-[240px]",
          isDateRange && hasDateSelection && "ring-1 ring-primary/50 bg-primary/5",
        )}
        ref={ref}
        onClick={handleClick}
        aria-pressed={isFilter ? filterActive : undefined}
        aria-haspopup={isDateRangeTrigger ? "dialog" : undefined}
        aria-expanded={isDateRangeTrigger ? !!startDate || !!endDate : undefined}
        aria-expanded={isDateRange ? hasDateSelection : undefined}
        role={isDateRange ? "combobox" : undefined}
        {...props}
      >
        {props.children}
        {isFilter && filterActive && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary">
            <span className="sr-only">Filter active</span>
          </span>
        )}
        {isDateRangeTrigger && (startDate || endDate) && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary">
            <span className="sr-only">Date range selected</span>
          </span>
        )}
        {isDateRange && hasDateSelection && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-primary animate-pulse">
            <span className="sr-only">Date range selected</span>
          </span>
        )}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

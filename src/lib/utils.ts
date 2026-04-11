import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const aedFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export const formatAed = (value: string | number): string => {
  const num =
    typeof value === "number" ? value : Number(String(value).replace(/,/g, ""))
  if (Number.isNaN(num)) return String(value)
  return aedFormatter.format(num)
}

export const aedHeaderKeys = new Set([
  "Estimated_Budget_AED",
  "Actual_Budget_AED",
  "Delta_AED",
])

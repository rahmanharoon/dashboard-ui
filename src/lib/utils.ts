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

export const currencyFormatter = (amount: string | number): string => {
  const num =
    typeof amount === "number"
      ? amount
      : Number(String(amount).replace(/,/g, ""))
  if (Number.isNaN(num)) return ""
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export const aedHeaderKeys = new Set([
  "Estimated_Budget_AED",
  "Actual_Budget_AED",
  "Delta_AED",
])

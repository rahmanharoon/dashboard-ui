import { useCallback, useState } from "react"

import {
  defaultFilters,
  defaultOptions,
  defaultPaginationValues,
} from "@/lib/constants"
import type { IFilterOptions, IFilters } from "@/interfaces/app.interface"

export const useFilters = () => {
  const [page, setPage] = useState(defaultPaginationValues.pageNo)
  const [size, setSize] = useState(defaultPaginationValues.size)

  const [filters, setFilters] = useState<IFilters>(defaultFilters)
  const [options, setOptions] = useState<IFilterOptions>(defaultOptions)

  const onChangeFilterVal = (key: string, value: string[] | string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const onChangeSize = (sizeVal: number) => setSize(sizeVal)

  const goTo = (page: number, totalPages: number) =>
    setPage(Math.max(1, Math.min(page, totalPages)))

  const goNext = (totalPages: number) => goTo(page + 1, totalPages)
  const goPrev = (totalPages: number) => goTo(page - 1, totalPages)

  const getFilterOptions = useCallback(
    (data: Record<string, string | number>[]) => {
      const companies: string[] = []
      const department: string[] = []
      const priority: string[] = []
      const expenseType: string[] = []
      const status: string[] = []
      const approvedStatus: string[] = []

      data?.forEach((dataItem) => {
        Object.keys(dataItem).forEach((keyValue) => {
          const value = dataItem[keyValue] as string

          if (keyValue === "Company_Name") companies.push(value)
          if (keyValue === "Department") department.push(value)
          if (keyValue === "Priority") priority.push(value)
          if (keyValue === "Expense_Type") expenseType.push(value)
          if (keyValue === "Status") status.push(value)
          if (keyValue === "Approval_Status") approvedStatus.push(value)
        })
      })

      setOptions({
        Company_Name: [...new Set(companies)],
        Department: [...new Set(department)],
        Priority: [...new Set(priority)],
        Expense_Type: [...new Set(expenseType)],
        Status: [...new Set(status)],
        Approval_Status: [...new Set(approvedStatus)],
      })
    },
    []
  )

  return {
    goTo,
    page,
    size,
    goNext,
    goPrev,
    options,
    filters,
    onChangeSize,
    getFilterOptions,
    onChangeFilterVal,
  }
}

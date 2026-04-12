import { useMemo } from "react"

import TableUI from "@/components/table-content"
import { useFilters } from "@/hooks/useFilters"
import type { ISheetsData } from "@/interfaces/app.interface"
import { budgetPeriodLabel } from "@/lib/budget-period-chart-data"

import { ReusableDialog } from "./reusable-dialog"

type BudgetPeriodDetailsModalProps = {
  open: boolean
  period: string | null
  variant: "actualVsExpected" | "delta"
  rows: ISheetsData[]
  onClose: () => void
}

const variantHeading: Record<
  BudgetPeriodDetailsModalProps["variant"],
  string
> = {
  actualVsExpected: "Actual vs expected budget",
  delta: "Delta",
}

const filterRowsByPeriod = (rows: ISheetsData[], period: string) =>
  rows.filter((row) => budgetPeriodLabel(row) === period)

export const BudgetPeriodDetailsModal = ({
  open,
  period,
  variant,
  rows,
  onClose,
}: BudgetPeriodDetailsModalProps) => {
  const {
    goNext,
    goPrev,
    goTo,
    onChangeSize,
    page,
    size,
  } = useFilters()

  const filteredRows = useMemo(() => {
    if (!period) return []
    return filterRowsByPeriod(rows, period)
  }, [rows, period])

  const totalItems = filteredRows.length

  const pageData = useMemo(() => {
    const start = (page - 1) * size
    return filteredRows.slice(start, start + size)
  }, [filteredRows, page, size])

  const title =
    period != null && period !== ""
      ? `${period} — ${variantHeading[variant]} details`
      : `${variantHeading[variant]} details`

  return (
    <ReusableDialog
      open={open && period != null}
      closeModal={onClose}
      title={title}
      className="flex w-[min(96vw,72rem)] max-w-[min(96vw,72rem)] flex-col gap-0 p-0 sm:max-w-[min(96vw,72rem)]"
      contentClassName="px-2 py-3 sm:px-4"
      content={
        period != null ? (
          <div className="overflow-x-auto">
            <TableUI
              data={pageData}
              goNext={goNext}
              goPrev={goPrev}
              goTo={goTo}
              pageNo={page}
              size={size}
              totalItems={totalItems}
              onChangeSize={onChangeSize}
            />
          </div>
        ) : undefined
      }
    />
  )
}

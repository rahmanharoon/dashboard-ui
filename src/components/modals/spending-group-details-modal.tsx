import { useMemo } from "react"

import TableUI from "@/components/table-content"
import { useFilters } from "@/hooks/useFilters"
import type { ISheetsData } from "@/interfaces/app.interface"

import { ReusableDialog } from "./reusable-dialog"

type SpendingGroupDetailsModalProps = {
  open: boolean
  groupField: string
  groupLabel: string | null
  otherMemberNames: string[] | null
  rows: ISheetsData[]
  onClose: () => void
}

const normalizeFieldValue = (row: ISheetsData, field: string) =>
  String(row[field] ?? "").trim() || "Unknown"

const filterRowsForGroup = (
  rows: ISheetsData[],
  field: string,
  groupLabel: string,
  otherMemberNames: string[] | null
) => {
  if (groupLabel === "Other" && otherMemberNames?.length) {
    const set = new Set(otherMemberNames)
    return rows.filter((row) => set.has(normalizeFieldValue(row, field)))
  }
  return rows.filter((row) => normalizeFieldValue(row, field) === groupLabel)
}

export const SpendingGroupDetailsModal = ({
  open,
  groupField,
  groupLabel,
  otherMemberNames,
  rows,
  onClose,
}: SpendingGroupDetailsModalProps) => {
  const {
    goNext,
    goPrev,
    goTo,
    onChangeSize,
    page,
    size,
  } = useFilters()

  const filteredRows = useMemo(() => {
    if (!groupLabel) return []
    return filterRowsForGroup(rows, groupField, groupLabel, otherMemberNames)
  }, [rows, groupField, groupLabel, otherMemberNames])

  const totalItems = filteredRows.length

  const pageData = useMemo(() => {
    const start = (page - 1) * size
    return filteredRows.slice(start, start + size)
  }, [filteredRows, page, size])

  const fieldTitle =
    groupField === "Owner"
      ? "Owner"
      : groupField === "Department"
        ? "Department"
        : groupField.replace(/_/g, " ")

  const title =
    groupLabel != null && groupLabel !== ""
      ? `${groupLabel} — ${fieldTitle} details`
      : `${fieldTitle} details`

  return (
    <ReusableDialog
      open={open && groupLabel != null}
      closeModal={onClose}
      title={title}
      className="flex w-[min(96vw,72rem)] max-w-[min(96vw,72rem)] flex-col gap-0 p-0 sm:max-w-[min(96vw,72rem)]"
      contentClassName="px-2 py-3 sm:px-4"
      content={
        groupLabel != null ? (
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

import type { ISheetsData } from "@/interfaces/app.interface"
import { useMemo } from "react"

const STATUS_FILL_CYCLE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const COL_KEYS = {
  estimated: "Estimated_Budget_AED",
  actual: "Actual_Budget_AED",
  delta: "Delta_AED",
  owner: "Owner",
  department: "Department",
  year: "Year",
  quarter: "Quarter",
} as const

function parseNumber(val: unknown): number {
  if (typeof val === "number" && Number.isFinite(val)) return val
  if (typeof val === "string") {
    const n = parseFloat(val.replace(/,/g, "").trim())
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function periodLabel(item: ISheetsData): string {
  const y = item[COL_KEYS.year]
  const q = item[COL_KEYS.quarter]
  const ys = y != null && String(y).trim() !== "" ? String(y).trim() : ""
  const qs = q != null && String(q).trim() !== "" ? String(q).trim() : ""
  if (ys && qs) return `${ys} · ${qs}`
  if (ys) return ys
  return "All"
}

function periodSortKey(label: string): number {
  const m = label.match(/(\d{4})/)
  const year = m ? parseInt(m[0], 10) : 0
  const qm = label.match(/Q\s*(\d)/i)
  const q = qm ? parseInt(qm[1], 10) : 0
  return year * 10 + q
}

function aggregateByField(
  rows: ISheetsData[],
  field: string,
  valueField: typeof COL_KEYS.actual
): { name: string; value: number }[] {
  const sums: Record<string, number> = {}
  for (const row of rows) {
    const key = String(row[field] ?? "").trim() || "Unknown"
    sums[key] = (sums[key] ?? 0) + parseNumber(row[valueField])
  }
  const entries = Object.entries(sums).map(([name, value]) => ({ name, value }))
  entries.sort((a, b) => b.value - a.value)
  return entries
}

function takeTopWithOther(
  entries: { name: string; value: number }[],
  limit: number
): { name: string; value: number }[] {
  if (entries.length <= limit) return entries
  const top = entries.slice(0, limit)
  const rest = entries.slice(limit).reduce((s, x) => s + x.value, 0)
  if (rest > 0) top.push({ name: "Other", value: rest })
  return top
}

export interface BudgetPeriodRow {
  period: string
  actual: number
  expected: number
  delta: number
}

export interface IChartsData {
  status: { name: string; value: number; fill: string }[]
  approvedStatus: Record<string, string | number>
  budgetByPeriod: BudgetPeriodRow[]
  spendingByOwner: { name: string; value: number }[]
  spendingByDepartment: { name: string; value: number }[]
}

const emptyCharts: IChartsData = {
  status: [],
  approvedStatus: {},
  budgetByPeriod: [],
  spendingByOwner: [],
  spendingByDepartment: [],
}

export function useChartsData(data: ISheetsData[]) {
  return useMemo(() => {
    if (!data?.length) {
      return { chartsData: emptyCharts }
    }

    const statusValues: Record<string, number> = {}
    const approvalStatus: Record<string, number> = {}

    const byPeriod: Record<
      string,
      { actual: number; expected: number; delta: number }
    > = {}

    for (const item of data) {
      const statusVal = item["Status"]
      const approvalStatusVal = item["Approval_Status"]
      if (statusVal) {
        statusValues[String(statusVal)] =
          (statusValues[String(statusVal)] ?? 0) + 1
      }
      if (approvalStatusVal) {
        const k = String(approvalStatusVal)
        approvalStatus[k] = (approvalStatus[k] ?? 0) + 1
      }

      const p = periodLabel(item)
      if (!byPeriod[p]) {
        byPeriod[p] = { actual: 0, expected: 0, delta: 0 }
      }
      const actual = parseNumber(item[COL_KEYS.actual])
      const expected = parseNumber(item[COL_KEYS.estimated])
      const delta =
        item[COL_KEYS.delta] !== undefined && item[COL_KEYS.delta] !== ""
          ? parseNumber(item[COL_KEYS.delta])
          : actual - expected

      byPeriod[p].actual += actual
      byPeriod[p].expected += expected
      byPeriod[p].delta += delta
    }

    const statusItems: IChartsData["status"] = []
    Object.keys(statusValues).forEach((key, indx) => {
      statusItems.push({
        name: key,
        value: statusValues[key],
        fill: STATUS_FILL_CYCLE[indx % STATUS_FILL_CYCLE.length],
      })
    })

    const periodKeys = Object.keys(byPeriod).sort(
      (a, b) => periodSortKey(a) - periodSortKey(b)
    )

    const budgetByPeriod: BudgetPeriodRow[] = periodKeys.map((period) => {
      const row = byPeriod[period]
      return {
        period,
        actual: row.actual,
        expected: row.expected,
        delta: row.delta,
      }
    })

    const ownerRaw = aggregateByField(data, COL_KEYS.owner, COL_KEYS.actual)
    const deptRaw = aggregateByField(data, COL_KEYS.department, COL_KEYS.actual)

    const chartsData: IChartsData = {
      status: statusItems,
      approvedStatus: {
        name: "Approval Status",
        ...approvalStatus,
      },
      budgetByPeriod,
      spendingByOwner: takeTopWithOther(ownerRaw, 10),
      spendingByDepartment: takeTopWithOther(deptRaw, 10),
    }

    return { chartsData }
  }, [data])
}

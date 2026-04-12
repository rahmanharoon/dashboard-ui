import type { ISheetsData } from "@/interfaces/app.interface"

export const BUDGET_COL_KEYS = {
  estimated: "Estimated_Budget_AED",
  actual: "Actual_Budget_AED",
  delta: "Delta_AED",
  year: "Year",
  quarter: "Quarter",
} as const

export type BudgetPeriodRow = {
  period: string
  actual: number
  expected: number
  delta: number
}

export const parseBudgetNumber = (val: unknown): number => {
  if (typeof val === "number" && Number.isFinite(val)) return val
  if (typeof val === "string") {
    const n = parseFloat(val.replace(/,/g, "").trim())
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export const budgetPeriodLabel = (item: ISheetsData): string => {
  const y = item[BUDGET_COL_KEYS.year]
  const q = item[BUDGET_COL_KEYS.quarter]
  const ys = y != null && String(y).trim() !== "" ? String(y).trim() : ""
  const qs = q != null && String(q).trim() !== "" ? String(q).trim() : ""
  if (ys && qs) return `${ys} · ${qs}`
  if (ys) return ys
  return "All"
}

const periodSortKey = (label: string): number => {
  const m = label.match(/(\d{4})/)
  const year = m ? parseInt(m[0], 10) : 0
  const qm = label.match(/Q\s*(\d)/i)
  const q = qm ? parseInt(qm[1], 10) : 0
  return year * 10 + q
}

export const buildBudgetPeriodChartData = (
  rows: ISheetsData[]
): BudgetPeriodRow[] => {
  if (!rows?.length) return []

  const byPeriod: Record<
    string,
    { actual: number; expected: number; delta: number }
  > = {}

  for (const item of rows) {
    const p = budgetPeriodLabel(item)
    if (!byPeriod[p]) {
      byPeriod[p] = { actual: 0, expected: 0, delta: 0 }
    }
    const actual = parseBudgetNumber(item[BUDGET_COL_KEYS.actual])
    const expected = parseBudgetNumber(item[BUDGET_COL_KEYS.estimated])
    const delta =
      item[BUDGET_COL_KEYS.delta] !== undefined &&
      item[BUDGET_COL_KEYS.delta] !== ""
        ? parseBudgetNumber(item[BUDGET_COL_KEYS.delta])
        : actual - expected

    byPeriod[p].actual += actual
    byPeriod[p].expected += expected
    byPeriod[p].delta += delta
  }

  const periodKeys = Object.keys(byPeriod).sort(
    (a, b) => periodSortKey(a) - periodSortKey(b)
  )

  return periodKeys.map((period) => {
    const row = byPeriod[period]
    return {
      period,
      actual: row.actual,
      expected: row.expected,
      delta: row.delta,
    }
  })
}

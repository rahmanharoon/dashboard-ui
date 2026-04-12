import type { BudgetPeriodRow } from "@/lib/budget-period-chart-data"

type BudgetPeriodClickDotProps = {
  cx?: number
  cy?: number
  r?: number
  payload?: BudgetPeriodRow
  fill: string
  onPickPeriod: (period: string) => void
}

export function BudgetPeriodClickDot({
  cx,
  cy,
  r = 5,
  payload,
  fill,
  onPickPeriod,
}: BudgetPeriodClickDotProps) {
  if (cx == null || cy == null || !payload?.period) return null

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      stroke="var(--background)"
      strokeWidth={2}
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        onPickPeriod(payload.period)
      }}
    />
  )
}

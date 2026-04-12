import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import type { BarRectangleItem } from "recharts/types/cartesian/Bar"

import { SpendingGroupDetailsModal } from "@/components/modals/spending-group-details-modal"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import { FALLBACK_CHART_COLORS } from "@/lib/constants"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

const ACTUAL_BUDGET_KEY = "Actual_Budget_AED" as const

const GROUP_FIELD = {
  owner: "Owner",
  department: "Department",
} as const

type SpendingHorizontalDatum = {
  name: string
  value: number
  otherNames?: string[]
}

const takeTopWithOther = (
  entries: { name: string; value: number }[],
  limit: number
): SpendingHorizontalDatum[] => {
  if (entries.length <= limit) return entries

  const topItems: SpendingHorizontalDatum[] = entries
    .slice(0, limit)
    .map((e) => ({ ...e }))

  const lastItems = entries.slice(limit)
  const restValue = lastItems.reduce((s, x) => s + x.value, 0)
  if (restValue > 0) {
    topItems.push({
      name: "Other",
      value: restValue,
      otherNames: lastItems.map((x) => x.name),
    })
  }
  return topItems
}

const buildSpendingHorizontalData = (
  rows: ISheetsData[],
  groupBy: keyof typeof GROUP_FIELD
): SpendingHorizontalDatum[] => {
  const field = GROUP_FIELD[groupBy]
  if (!rows?.length) return []
  const sums: Record<string, number> = {}

  for (const row of rows) {
    const key = row[field]
    sums[key] = (sums[key] ?? 0) + Number(row[ACTUAL_BUDGET_KEY])
  }
  const entries = Object.entries(sums).map(([name, value]) => ({ name, value }))
  entries.sort((a, b) => b.value - a.value)

  return takeTopWithOther(entries, 10)
}

const chartConfig = {
  value: {
    label: "Spend (AED)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type SpendingSelection = {
  name: string
  otherNames: string[] | null
}

export function SpendingHorizontalChart({
  title,
  data,
  groupBy,
  emptyMessage = "No spending data for this filter.",
}: {
  title: string
  data: ISheetsData[]
  groupBy: keyof typeof GROUP_FIELD
  emptyMessage?: string
}) {
  const [selection, setSelection] = useState<SpendingSelection | null>(null)

  const chartData = useMemo(
    () => buildSpendingHorizontalData(data, groupBy),
    [data, groupBy]
  )

  const groupField = GROUP_FIELD[groupBy]

  const onBarClick = (item: BarRectangleItem) => {
    const payload = item.payload as SpendingHorizontalDatum | undefined
    if (!payload?.name) return
    setSelection({
      name: payload.name,
      otherNames: payload.otherNames ?? null,
    })
  }

  const closeModal = () => setSelection(null)

  if (!chartData.length) {
    return (
      <Card className="flex flex-col gap-3 p-4">
        <Label className="text-base">{title}</Label>
        <p className="text-muted-foreground py-12 text-center text-sm">
          {emptyMessage}
        </p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <Label className="text-base">{title}</Label>
      <ChartContainer
        config={chartConfig}
        className="w-full"
        style={{
          minHeight: Math.max(240, chartData.length * 40),
        }}
      >
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={chartData}
          margin={{ left: 4, right: 12 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              typeof v === "number" ? v.toLocaleString() : String(v)
            }
          />
          <YAxis
            dataKey="name"
            type="category"
            width={112}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) =>
              String(v).length > 16 ? `${String(v).slice(0, 14)}…` : String(v)
            }
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "var(--muted)", opacity: 0.25 }}
          />
          <Bar
            dataKey="value"
            radius={4}
            cursor="pointer"
            fill="var(--color-value)"
            onClick={onBarClick}
          >
            {chartData.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={
                  FALLBACK_CHART_COLORS[i % FALLBACK_CHART_COLORS.length]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <SpendingGroupDetailsModal
        open={selection != null}
        groupField={groupField}
        groupLabel={selection?.name ?? null}
        otherMemberNames={selection?.otherNames ?? null}
        rows={data}
        onClose={closeModal}
      />
    </Card>
  )
}

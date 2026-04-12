import { memo, useMemo, useState, type CSSProperties } from "react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import type { BarRectangleItem } from "recharts/types/cartesian/Bar"
import type { XAxisTickContentProps } from "recharts/types/util/types"

import { DirhamSymbol } from "@/components/dirham-symbol"
import { SpendingGroupDetailsModal } from "@/components/modals/spending-group-details-modal"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import { FALLBACK_CHART_COLORS } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"

const ACTUAL_BUDGET_KEY = "Actual_Budget_AED" as const

const GROUP_FIELD = {
  owner: "Owner",
  department: "Department",
} as const

type SpendingHorizontalDatum = {
  barId: string
  name: string
  value: number
  otherNames?: string[]
}

const SpendingHorizontalXAxisTick = (props: XAxisTickContentProps) => {
  const { x, y, payload } = props
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
        dy={12}
      >
        <tspan className="dirham-symbol">{"\uE000"}</tspan>
        <tspan dx={3} className="tabular-nums">
          {payload.value}
        </tspan>
      </text>
    </g>
  )
}

type SpendingHorizontalRow = {
  name: string
  value: number
  otherNames?: string[]
}

const buildSpendingHorizontalData = (
  rows: ISheetsData[],
  groupBy: keyof typeof GROUP_FIELD
): SpendingHorizontalRow[] => {
  const field = GROUP_FIELD[groupBy]
  if (!rows?.length) return []
  const sums: Record<string, number> = {}

  for (const row of rows) {
    const key = row[field]
    sums[key] = (sums[key] ?? 0) + Number(row[ACTUAL_BUDGET_KEY])
  }
  const entries = Object.entries(sums).map(([name, value]) => ({ name, value }))
  entries.sort((a, b) => b.value - a.value)

  return entries
}

type SpendingSelection = {
  name: string
  otherNames: string[] | null
}

const SpendingHorizontalChart = ({
  title,
  data,
  groupBy,
  emptyMessage = "No spending data for this filter.",
}: {
  title: string
  data: ISheetsData[]
  groupBy: keyof typeof GROUP_FIELD
  emptyMessage?: string
}) => {
  const [selection, setSelection] = useState<SpendingSelection | null>(null)

  const { chartData, chartConfig } = useMemo(() => {
    const rows = buildSpendingHorizontalData(data, groupBy)
    const chartConfig: ChartConfig = {
      value: {
        label: (
          <span className="inline-flex items-baseline gap-1">
            <DirhamSymbol />
            <span>Spend</span>
          </span>
        ),
      },
    }
    const chartData: SpendingHorizontalDatum[] = rows.map((row, i) => {
      const barId = `bar_${i}`
      chartConfig[barId] = {
        label: row.name,
        color: FALLBACK_CHART_COLORS[i % FALLBACK_CHART_COLORS.length],
      }
      return { ...row, barId }
    })
    return { chartData, chartConfig }
  }, [data, groupBy])

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
    <Card className="flex flex-col">
      <CardHeader className="items-center justify-center w-full">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full min-w-0 w-full flex flex-col items-stretch pl-3 pr-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-video w-full min-w-0 justify-start"
        >
          <BarChart
            accessibilityLayer
            layout="vertical"
            data={chartData}
            margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={SpendingHorizontalXAxisTick}
            />
            <YAxis
              dataKey="name"
              type="category"
              width="auto"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                String(v).length > 16 ? `${String(v).slice(0, 14)}…` : String(v)
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="barId"
                  formatter={(value, _name, item) => {
                    const row = item.payload as SpendingHorizontalDatum
                    const indicatorColor = row?.barId
                      ? `var(--color-${row.barId})`
                      : FALLBACK_CHART_COLORS[0]
                    return (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)"
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as CSSProperties
                          }
                        />
                        <div className="flex flex-1 justify-between gap-2 leading-none">
                          <span className="text-muted-foreground">
                            {row?.name}
                          </span>
                          <span className="flex items-baseline gap-1 font-mono font-medium text-foreground tabular-nums">
                            <DirhamSymbol />
                            {value}
                          </span>
                        </div>
                      </>
                    )
                  }}
                />
              }
              cursor={{ fill: "var(--muted)", opacity: 0.25 }}
            />
            <Bar
              dataKey="value"
              name="Spend"
              radius={10}
              cursor="pointer"
              fill={`var(--color-${chartData[0].barId})`}
              onClick={onBarClick}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={`var(--color-${entry.barId})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
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

export default memo(SpendingHorizontalChart)  

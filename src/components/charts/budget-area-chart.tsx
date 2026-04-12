import { useId, useMemo, useState, type CSSProperties } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { YAxisTickContentProps } from "recharts/types/util/types"

import { BudgetPeriodClickDot } from "@/components/charts/budget-period-click-dot"
import { DirhamSymbol } from "@/components/dirham-symbol"
import { BudgetPeriodDetailsModal } from "@/components/modals/budget-period-details-modal"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import {
  buildBudgetPeriodChartData,
  type BudgetPeriodRow,
} from "@/lib/budget-period-chart-data"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { currencyFormatter } from "@/lib/utils"

export type { BudgetPeriodRow } from "@/lib/budget-period-chart-data"

const BUDGET_Y_AXIS_WIDTH = 80

function BudgetAmountYAxisTick(props: YAxisTickContentProps) {
  const { x, y, payload } = props
  const text = currencyFormatter(payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="end"
        className="fill-muted-foreground text-xs"
        dy={3}
        dx={0}
      >
        <tspan className="dirham-symbol">{"\uE000"}</tspan>
        <tspan dx={3} className="tabular-nums">
          {text}
        </tspan>
      </text>
    </g>
  )
}

const chartConfig = {
  expected: {
    label: "Expected budget",
    color: "var(--chart-2)",
  },
  actual: {
    label: "Actual budget",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function BudgetAreaChart({
  title,
  data,
}: {
  title: string
  data: ISheetsData[]
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const chartData = useMemo(() => buildBudgetPeriodChartData(data), [data])

  const uid = useId().replace(/:/g, "")
  const gradExpected = `fe${uid}Exp`
  const gradActual = `fe${uid}Act`

  const closeModal = () => setSelectedPeriod(null)

  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="items-center justify-center w-full">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full w-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-video w-full justify-start"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <defs>
              <linearGradient id={gradActual} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-actual)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-actual)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) =>
                String(v).length > 18 ? `${String(v).slice(0, 16)}…` : String(v)
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={BUDGET_Y_AXIS_WIDTH}
              tickMargin={4}
              tick={BudgetAmountYAxisTick}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    const rowLabel = String(name ?? "")
                    const indicatorColor =
                      item.dataKey === "expected"
                        ? "var(--color-expected)"
                        : "var(--color-actual)"
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
                            {rowLabel}
                          </span>
                          <span className="flex items-baseline gap-1 font-mono font-medium text-foreground tabular-nums">
                            <DirhamSymbol />
                            {currencyFormatter(value as string | number)}
                          </span>
                        </div>
                      </>
                    )
                  }}
                />
              }
            />
            <Area
              dataKey="expected"
              name="Expected budget"
              type="natural"
              fill={`url(#${gradExpected})`}
              stroke="var(--color-expected)"
              strokeWidth={1.5}
              dot={false}
              activeDot={(props) => (
                <BudgetPeriodClickDot
                  cx={props.cx}
                  cy={props.cy}
                  r={typeof props.r === "number" ? props.r : 6}
                  payload={props.payload as BudgetPeriodRow}
                  fill="var(--color-expected)"
                  onPickPeriod={setSelectedPeriod}
                />
              )}
            />
            <Area
              dataKey="actual"
              name="Actual budget"
              type="natural"
              fill={`url(#${gradActual})`}
              stroke="var(--color-actual)"
              strokeWidth={1.5}
              dot={(props) => (
                <BudgetPeriodClickDot
                  cx={props.cx}
                  cy={props.cy}
                  payload={props.payload as BudgetPeriodRow}
                  fill="var(--color-actual)"
                  onPickPeriod={setSelectedPeriod}
                />
              )}
              activeDot={(props) => (
                <BudgetPeriodClickDot
                  cx={props.cx}
                  cy={props.cy}
                  r={typeof props.r === "number" ? props.r : 6}
                  payload={props.payload as BudgetPeriodRow}
                  fill="var(--color-actual)"
                  onPickPeriod={setSelectedPeriod}
                />
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <BudgetPeriodDetailsModal
        open={selectedPeriod != null}
        period={selectedPeriod}
        variant="actualVsExpected"
        rows={data}
        onClose={closeModal}
      />
    </Card>
  )
}

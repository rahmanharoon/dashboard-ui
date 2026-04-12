import { useId, useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { BudgetPeriodClickDot } from "@/components/charts/budget-period-click-dot"
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
import { Card } from "../ui/card"
import { Label } from "../ui/label"

export type { BudgetPeriodRow } from "@/lib/budget-period-chart-data"

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
    <Card className="flex flex-col gap-3 p-4">
      <Label className="text-base">{title}</Label>
      <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
        <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 12 }}>
          <defs>
            <linearGradient id={gradExpected} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-expected)"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="var(--color-expected)"
                stopOpacity={0.02}
              />
            </linearGradient>
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
            width={56}
            tickFormatter={(v) =>
              typeof v === "number" ? v.toLocaleString() : String(v)
            }
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="expected"
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

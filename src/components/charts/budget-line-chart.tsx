import { useMemo, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  delta: {
    label: "Delta (AED)",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function BudgetLineChart({
  title,
  data,
}: {
  title: string
  data: ISheetsData[]
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

  const chartData = useMemo(() => buildBudgetPeriodChartData(data), [data])

  const closeModal = () => setSelectedPeriod(null)

  return (
    <Card className="flex flex-col gap-3 p-4">
      <Label className="text-base">{title}</Label>
      <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
        <LineChart accessibilityLayer data={chartData} margin={{ left: 0, right: 12 }}>
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
          <Line
            dataKey="delta"
            type="natural"
            stroke="var(--color-delta)"
            strokeWidth={2}
            dot={(props) => (
              <BudgetPeriodClickDot
                cx={props.cx}
                cy={props.cy}
                payload={props.payload as BudgetPeriodRow}
                fill="var(--color-delta)"
                onPickPeriod={setSelectedPeriod}
              />
            )}
            activeDot={(props) => (
              <BudgetPeriodClickDot
                cx={props.cx}
                cy={props.cy}
                r={typeof props.r === "number" ? props.r : 6}
                payload={props.payload as BudgetPeriodRow}
                fill="var(--color-delta)"
                onPickPeriod={setSelectedPeriod}
              />
            )}
          />
        </LineChart>
      </ChartContainer>
      <BudgetPeriodDetailsModal
        open={selectedPeriod != null}
        period={selectedPeriod}
        variant="delta"
        rows={data}
        onClose={closeModal}
      />
    </Card>
  )
}

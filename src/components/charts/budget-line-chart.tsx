import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { BudgetPeriodRow } from "@/hooks/useChartsData"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

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
  data: BudgetPeriodRow[]
}) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <Label className="text-base">{title}</Label>
      <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
        <LineChart accessibilityLayer data={data} margin={{ left: 0, right: 12 }}>
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
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  )
}

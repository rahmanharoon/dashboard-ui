import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  data: BudgetPeriodRow[]
}) {
  const uid = React.useId().replace(/:/g, "")
  const gradExpected = `fe${uid}Exp`
  const gradActual = `fe${uid}Act`

  return (
    <Card className="flex flex-col gap-3 p-4">
      <Label className="text-base">{title}</Label>
      <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
        <AreaChart accessibilityLayer data={data} margin={{ left: 0, right: 12 }}>
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
          />
          <Area
            dataKey="actual"
            type="natural"
            fill={`url(#${gradActual})`}
            stroke="var(--color-actual)"
            strokeWidth={1.5}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  )
}

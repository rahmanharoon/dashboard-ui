import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

const FALLBACK = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const chartConfig = {
  value: {
    label: "Spend (AED)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SpendingHorizontalChart({
  title,
  data,
  emptyMessage = "No spending data for this filter.",
}: {
  title: string
  data: { name: string; value: number }[]
  emptyMessage?: string
}) {
  if (!data.length) {
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
          minHeight: Math.max(240, data.length * 40),
        }}
      >
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={data}
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
          <Bar dataKey="value" radius={4}>
            {data.map((_, i) => (
              <Cell key={i} fill={FALLBACK[i % FALLBACK.length]} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  )
}

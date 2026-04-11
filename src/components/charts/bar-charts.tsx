import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

const SERIES_COLORS: Record<string, string> = {
  Pending: "var(--chart-3)",
  Approved: "var(--chart-2)",
  Rejected: "var(--destructive)",
}

const FALLBACK_CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

const BarChartUI = ({
  title,
  data,
}: {
  title: string
  data: Record<string, string | number>[]
}) => {
  const seriesKeys = useMemo(() => {
    const row = data[0]
    if (!row) return []
    return Object.keys(row).filter((k) => k !== "name")
  }, [data])

  const chartConfig = useMemo(() => {
    const cfg: ChartConfig = {}
    seriesKeys.forEach((key, i) => {
      cfg[key] = {
        label: key.replace(/_/g, " "),
        color:
          SERIES_COLORS[key] ??
          FALLBACK_CHART_COLORS[i % FALLBACK_CHART_COLORS.length],
      }
    })
    return cfg
  }, [seriesKeys])

  return (
    <Card className="items-center gap-10">
      <Label>{title}</Label>
      <ChartContainer
        config={chartConfig}
        className="aspect-[1.618] max-h-[70vh] min-h-[280px] w-full max-w-[700px]"
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            top: 5,
            right: 12,
            left: 12,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {seriesKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={[10, 10, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </Card>
  )
}

export default BarChartUI

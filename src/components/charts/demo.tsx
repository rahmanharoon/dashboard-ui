"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import { useMemo } from "react"
import { FALLBACK_CHART_COLORS } from "@/lib/constants"

export const description = "A bar chart"

interface IChartProps {
  status: string
  data: ISheetsData[]
}

export function ChartBarDefault({ data, status }: IChartProps) {
  console.log("🚀 ~ ChartBarDefault ~ data:", data)
  const chartData = useMemo(() => {
    const newData: Record<string, number> = {}

    data.forEach((items) => {
      if (items?.Status === status) {
        newData[items?.Company_Name] = (newData[items?.Company_Name] ?? 0) + 1
      }
    })

    return Object.entries(newData)
      .map(([company, count], index) => ({
        company,
        count,
        fill: FALLBACK_CHART_COLORS[index],
      }))
      .sort((a, b) => a.count - b.count)
  }, [data, status])
  console.log("🚀 ~ ChartBarDefault ~ chartData:", chartData)

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {}

    for (const item of chartData) {
      config[item?.company] = {
        color: item?.fill,
        label: item?.company,
      }
    }

    return config
  }, [chartData])
  console.log("🚀 ~ ChartBarDefault ~ chartConfig:", chartConfig)

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="company"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

import { useMemo } from "react"
import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

interface IChartsProps {
  title: string
  data: { name: string; value: number; fill: string }[]
}

export default function PieChartWithPaddingAngle({
  data,
  title,
}: IChartsProps) {
  const pieData = useMemo(
    () =>
      data.map((item, i) => ({
        ...item,
        sliceId: `slice_${i}` as const,
      })),
    [data]
  )

  const chartConfig = useMemo(() => {
    const cfg: ChartConfig = {}
    pieData.forEach((item) => {
      cfg[item.sliceId] = {
        label: item.name,
        color: item.fill,
      }
    })
    return cfg
  }, [pieData])

  return (
    <Card className="items-center gap-10">
      <Label id="charts-title">{title}</Label>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] min-h-[250px] w-full max-w-[500px]"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="sliceId" />} />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="sliceId"
            innerRadius="80%"
            outerRadius="100%"
            cornerRadius="50%"
            paddingAngle={5}
            strokeWidth={0}
            isAnimationActive
          >
            {pieData.map((entry) => (
              <Cell
                key={entry.sliceId}
                fill={`var(--color-${entry.sliceId})`}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {data?.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: item.fill }}
            />
            <Label>{item.name}</Label>
          </div>
        ))}
      </div>
    </Card>
  )
}

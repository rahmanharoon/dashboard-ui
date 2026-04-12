import { useMemo, useState } from "react"
import { Cell, Pie, PieChart } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"

import { StatusModal } from "@/components/modals/status-details-modal"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartIcon } from "@/components/charts/chart-icon"
import type { ISheetsData } from "@/interfaces/app.interface"
import { statusColors } from "@/lib/constants"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

export type StatusPieDatum = {
  name: string
  value: number
  fill: string
  sliceId: `slice_${number}`
}

const buildStatusPieData = (rows: ISheetsData[]): StatusPieDatum[] => {
  if (!rows?.length) return []

  const statusValues: Record<string, number> = {}
  for (const item of rows) {
    const statusVal = item["Status"]
    if (statusVal) {
      const k = String(statusVal)
      statusValues[k] = (statusValues[k] ?? 0) + 1
    }
  }

  const statusItems: StatusPieDatum[] = []
  Object.keys(statusValues).forEach((key, indx) => {
    statusItems.push({
      name: key,
      value: statusValues[key],
      fill: statusColors[key as keyof typeof statusColors],
      sliceId: `slice_${indx}`,
    })
  })
  return statusItems
}

interface IChartsProps {
  title: string
  data: ISheetsData[]
}

const PieChartWithPaddingAngle = ({ data, title }: IChartsProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const { pieData, chartConfig } = useMemo(() => {
    const pieData = buildStatusPieData(data)
    const chartConfig: ChartConfig = {}
    pieData.forEach((item) => {
      chartConfig[item.sliceId] = {
        label: item.name,
        color: item.fill,
      }
    })
    return { pieData, chartConfig }
  }, [data])

  const onPieClick = (sector: PieSectorDataItem) => {
    const status = sector?.name ?? sector?.payload?.name
    if (status != null) setSelectedStatus(status)
  }

  const closeStatusModal = () => setSelectedStatus(null)

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
            cursor="pointer"
            onClick={onPieClick}
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
        {pieData.map((item) => (
          <ChartIcon
            key={item.sliceId}
            title={item.name}
            color={item.fill}
            onCardClick={() => setSelectedStatus(item.name)}
          />
        ))}
      </div>
      <StatusModal
        open={selectedStatus != null}
        status={selectedStatus}
        rows={data}
        onClose={closeStatusModal}
      />
    </Card>
  )
}

export default PieChartWithPaddingAngle

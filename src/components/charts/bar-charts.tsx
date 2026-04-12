import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts"
import type { BarRectangleItem } from "recharts/types/cartesian/Bar"

import { ChartIcon } from "@/components/charts/chart-icon"
import { ApprovalStatusDetailsModal } from "@/components/modals/approval-details-modal"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import { statusColors } from "@/lib/constants"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

type ApprovalBarDatum = {
  status: string
  count: number
  fill: string
}

const chartConfig = {
  Approved: {
    label: "Approved",
    color: statusColors.Approved,
  },
  Pending: {
    label: "Pending",
    color: statusColors.Pending,
  },
  Rejected: {
    label: "Rejected",
    color: statusColors.Rejected,
  },
} satisfies ChartConfig

const buildApprovalBarData = (rows: ISheetsData[]): ApprovalBarDatum[] => {
  if (!rows?.length) return []

  const counts: Record<string, number> = {}
  for (const item of rows) {
    const approvalStatusVal = item.Approval_Status
    if (approvalStatusVal) {
      const k = String(approvalStatusVal)
      counts[k] = (counts[k] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([status, count]) => ({ status, count, fill: statusColors[status as keyof typeof statusColors], }))
    .sort((a, b) => a.status.localeCompare(b.status))
}

const BarChartUI = ({
  title,
  data,
}: {
  title: string
  data: ISheetsData[]
}) => {
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState<
    string | null
  >(null)

  const chartData = useMemo(() => buildApprovalBarData(data), [data])

  const onBarClick = (item: BarRectangleItem) => {
    const status = item.payload?.status
    setSelectedApprovalStatus(status)
  }

  const closeApprovalModal = () => setSelectedApprovalStatus(null)

  return (
    <Card className="items-center gap-10">
      <Label>{title}</Label>
      <ChartContainer
        config={chartConfig}
        className="aspect-[1.618] max-h-[70vh] min-h-[280px] w-full max-w-[700px]"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 5,
            right: 12,
            left: 12,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" tickLine={false} axisLine={false} />
          <YAxis width="auto" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[10, 10, 0, 0]}
            cursor="pointer"
            onClick={onBarClick}
          >
            {chartData.map((entry) => (
              <Cell key={entry.status} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {chartData.map((item) => (
          <ChartIcon
            key={item.status}
            title={item.status}
            color={item.fill}
            onCardClick={() => setSelectedApprovalStatus(item.status)}
          />
        ))}
      </div>
      <ApprovalStatusDetailsModal
        open={selectedApprovalStatus != null}
        approvalStatus={selectedApprovalStatus}
        rows={data}
        onClose={closeApprovalModal}
      />
    </Card>
  )
}

export default BarChartUI

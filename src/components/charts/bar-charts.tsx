import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"

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
    <Card className="flex flex-col">
      <CardHeader className="items-center justify-center w-full">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full justify-center items-center">
        <ChartContainer
          config={chartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[10, 10, 10, 10]}
              cursor="pointer"
              onClick={onBarClick}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-2 w-full">
        {chartData.map((item) => (
          <ChartIcon
            key={item.status}
            title={item.status}
            color={item.fill}
            onCardClick={() => setSelectedApprovalStatus(item.status)}
          />
        ))}
      </CardFooter>
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

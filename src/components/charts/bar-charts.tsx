import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { RechartsDevtools } from "@recharts/devtools"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

// #endregion
const BarChartUI = ({
  title,
  data,
}: {
  title: string
  data: Record<string, string | number>[]
}) => {
  return (
    <Card className="items-center gap-10">
      <Label>{title}</Label>
      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width="auto" />
        <Tooltip />
        <Legend />
        <Bar dataKey="Pending" fill="#808080" radius={[10, 10, 0, 0]} />
        <Bar dataKey="Approved" fill="#82ca9d" radius={[10, 10, 0, 0]} />
        <Bar dataKey="Rejected" fill="#FF0000" radius={[10, 10, 0, 0]} />
        <RechartsDevtools />
      </BarChart>
    </Card>
  )
}

export default BarChartUI

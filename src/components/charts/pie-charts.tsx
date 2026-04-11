import { Pie, PieChart } from "recharts"
import { RechartsDevtools } from "@recharts/devtools"
import { Card } from "../ui/card"
import { Label } from "../ui/label"

interface IChartsProps {
  title: string
  data: { name: string; value: number; fill: string }[]
}

// #endregion
export default function PieChartWithPaddingAngle({
  data,
  title,
}: IChartsProps) {
  return (
    <Card className="items-center gap-10">
      <Label htmlFor="charts-title">{title}</Label>
      <PieChart
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "250px",
          aspectRatio: 1,
        }}
        responsive
      >
        <Pie
          data={data}
          innerRadius="80%"
          outerRadius="100%"
          // Corner radius is the rounded edge of each pie slice
          cornerRadius="50%"
          fill="#8884d8"
          // padding angle is the gap between each pie slice
          paddingAngle={5}
          dataKey="value"
          isAnimationActive
        />
        <RechartsDevtools />
      </PieChart>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {data?.map((item) => (
          <div key={item?.name} className="flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-sm`}
              style={{ backgroundColor: item?.fill }}
            />
            <Label>{item?.name}</Label>
          </div>
        ))}
      </div>
    </Card>
  )
}

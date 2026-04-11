import { useChartsData } from "@/hooks/useChartsData"
import BarChartUI from "./bar-charts"
import PieChartWithPaddingAngle from "./pie-charts"
import type { ISheetsData } from "@/interfaces/app.interface"

const ChartsView = ({ data }: { data: ISheetsData[] }) => {
  const { chartsData } = useChartsData(data)
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Pie Chart */}
        <PieChartWithPaddingAngle title="Status" data={chartsData?.status} />
        {/* Bar chart */}
        <BarChartUI
          title="Approved Status"
          data={[chartsData?.approvedStatus]}
        />
      </div>
    </div>
  )
}

export default ChartsView

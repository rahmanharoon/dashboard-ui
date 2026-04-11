import { useChartsData } from "@/hooks/useChartsData"
import type { ISheetsData } from "@/interfaces/app.interface"

import BarChartUI from "./bar-charts"
import { BudgetAreaChart } from "./budget-area-chart"
import { BudgetLineChart } from "./budget-line-chart"
import PieChartWithPaddingAngle from "./pie-charts"
import { SpendingHorizontalChart } from "./spending-horizontal-chart"

const ChartsView = ({ data }: { data: ISheetsData[] }) => {
  const { chartsData } = useChartsData(data)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <PieChartWithPaddingAngle title="Status" data={chartsData.status} />
      <BarChartUI
        title="Approved Status"
        data={[chartsData.approvedStatus]}
      />
      <SpendingHorizontalChart
        title="Spending by owner"
        data={chartsData.spendingByOwner}
      />
      <SpendingHorizontalChart
        title="Spending by department"
        data={chartsData.spendingByDepartment}
      />
      <BudgetAreaChart
        title="Actual vs expected budget (by period)"
        data={chartsData.budgetByPeriod}
      />
      <BudgetLineChart
        title="Delta (by period)"
        data={chartsData.budgetByPeriod}
      />
    </div>
  )
}

export default ChartsView

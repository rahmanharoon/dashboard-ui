import type { ISheetsData } from "@/interfaces/app.interface"

import BarChartUI from "./bar-charts"
import { BudgetAreaChart } from "./budget-area-chart"
import { BudgetLineChart } from "./budget-line-chart"
import PieChartWithPaddingAngle from "./pie-charts"
import { SpendingHorizontalChart } from "./spending-horizontal-chart"

const ChartsView = ({ data }: { data: ISheetsData[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <PieChartWithPaddingAngle title="Status" data={data} />
      <BarChartUI title="Approved Status" data={data} />
      <SpendingHorizontalChart
        title="Spending by owner"
        data={data}
        groupBy="owner"
      />
      <SpendingHorizontalChart
        title="Spending by department"
        data={data}
        groupBy="department"
      />
      <BudgetAreaChart
        title="Actual vs expected budget (by period)"
        data={data}
      />
      <BudgetLineChart title="Delta (by period)" data={data} />
    </div>
  )
}

export default ChartsView

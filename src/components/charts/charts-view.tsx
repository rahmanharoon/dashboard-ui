import type { ISheetsData } from "@/interfaces/app.interface"
import { cn } from "@/lib/utils"

import BarChartUI from "./bar-charts"
import { BudgetAreaChart } from "./budget-area-chart"
import { BudgetLineChart } from "./budget-line-chart"
import PieChartWithPaddingAngle from "./pie-charts"
import { SpendingHorizontalChart } from "./spending-horizontal-chart"
import { memo, useMemo, useState } from "react"

const EXPENSE_TYPE_TABS = [
  { label: "Capex", value: "CapEx" },
  { label: "Opex", value: "OpEx" },
] as const

type ExpenseTypeTabValue = (typeof EXPENSE_TYPE_TABS)[number]["value"]

const ChartsView = ({ data }: { data: ISheetsData[] }) => {
  const [selectedTab, setSelectedTab] =
    useState<ExpenseTypeTabValue>("CapEx")

  const chartData = useMemo(
    () =>
      data.filter(
        (item) => String(item["Expense_Type"] ?? "") === selectedTab,
      ),
    [data, selectedTab],
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center">
        <div
          className="inline-flex w-fit rounded-full border border-border bg-background p-1 shadow-sm"
          role="tablist"
          aria-label="Expense type"
        >
          {EXPENSE_TYPE_TABS.map((tab) => {
            const isActive = selectedTab === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedTab(tab.value)}
                className={cn(
                  "cursor-pointer rounded-full px-5 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PieChartWithPaddingAngle title="Status" data={chartData} />
        <BarChartUI title="Approved Status" data={chartData} />
        <SpendingHorizontalChart
          title="Spending by owner"
          data={chartData}
          groupBy="owner"
        />
        <SpendingHorizontalChart
          title="Spending by department"
          data={chartData}
          groupBy="department"
        />
        <BudgetAreaChart
          title="Actual vs expected budget (by period)"
          data={chartData}
        />
        <BudgetLineChart title="Delta (by period)" data={chartData} />
      </div>
    </div>
  )
}

export default memo(ChartsView)

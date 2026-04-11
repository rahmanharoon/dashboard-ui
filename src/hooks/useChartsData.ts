import type { ISheetsData } from "@/interfaces/app.interface"
import { useCallback, useEffect, useState } from "react"

const colors: Record<number, string> = {
  0: "#00C49F",
  1: "#0088FE",
  2: "#FFBB28",
  3: "#FF8042",
}

interface IChartsData {
  status: {
    name: string
    value: number
    fill: string
  }[]
  approvedStatus: Record<string, string | number>
}

export const useChartsData = (data: ISheetsData[]) => {
  const [chartsData, setChartsData] = useState<IChartsData>({
    approvedStatus: {},
    status: [],
  })

  const getChartData = useCallback(() => {
    const statusValues: Record<string, number> = {}
    const approvalStatus: Record<string, number> = {}

    data?.forEach((item) => {
      const statusVal = item["Status"]
      const approvalStatusVal = item["Approval_Status"]
      if (statusVal) {
        statusValues[statusVal] = (statusValues[statusVal] ?? 0) + 1
      }
      if (approvalStatusVal) {
        approvalStatus[approvalStatusVal] =
          (approvalStatus[approvalStatusVal] ?? 0) + 1
      }
    })

    const statusItems: { name: string; value: number; fill: string }[] = []

    Object.keys(statusValues).map((key, indx) =>
      statusItems.push({
        name: key,
        value: statusValues[key],
        fill: colors[indx],
      })
    )

    setChartsData({
      status: statusItems,
      approvedStatus: {
        name: "Approval Status",
        ...approvalStatus,
      },
    })
  }, [data])

  useEffect(() => {
    getChartData()
  }, [getChartData])

  return { chartsData }
}

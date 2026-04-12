import { useCallback, useEffect, useState } from "react"

import SpinningLoader from "@/components/spinning-loader"
import MenuTabs from "@/components/ui/menu-tabs"
import { EmptyOutline } from "@/components/empty"
import { useFilePicker } from "@/hooks/useFilePicker"
import { useSheet } from "@/hooks/useSheet"
import TableUI from "@/components/table-content"
import { useFilters } from "@/hooks/useFilters"
import FilterList from "@/components/filter-list"
import type { ISheetsData } from "@/interfaces/app.interface"
import ChartsView from "@/components/charts/charts-view"

const Main = () => {
  const { readFile } = useSheet()
  const { openFile } = useFilePicker()
  const {
    goNext,
    goPrev,
    goTo,
    onChangeSize,
    page,
    size,
    filters,
    options,
    getFilterOptions,
    onChangeFilterVal,
    resetFn,
  } = useFilters()

  const [view, setView] = useState<"dashboard" | "list">("dashboard")
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ISheetsData[]>([])
  const [filteredData, setFilterData] = useState<ISheetsData[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)

  const onChangeView = (viewType: "dashboard" | "list") => setView(viewType)

  const getFilterData = useCallback(() => {
    if (!data) return

    const filteredValues = data?.filter((item) => {
      if (filters.search) {
        const searchValue = filters.search.toLowerCase()
        const companyMatch = String(item["Company_Name"] ?? "")
          .toLowerCase()
          .includes(searchValue)
        const ownerMatch = String(item["Owner"] ?? "")
          .toLowerCase()
          .includes(searchValue)
        const initiativeMatch = String(item["Initiative"] ?? "")
          .toLowerCase()
          .includes(searchValue)
        if (!companyMatch && !ownerMatch && !initiativeMatch) return false
      }
      if (
        filters.Company_Name?.length &&
        !filters.Company_Name.includes(String(item["Company_Name"]))
      ) {
        return false
      }
      if (
        filters.Department?.length &&
        !filters.Department.includes(String(item["Department"]))
      ) {
        return false
      }
      if (
        filters.Priority?.length &&
        !filters.Priority.includes(String(item["Priority"]))
      ) {
        return false
      }
      if (
        filters.Expense_Type?.length &&
        !filters.Expense_Type.includes(String(item["Expense_Type"]))
      ) {
        return false
      }
      if (
        filters.Status?.length &&
        !filters.Status.includes(String(item["Status"]))
      ) {
        return false
      }
      if (
        filters.Approval_Status?.length &&
        !filters.Approval_Status.includes(String(item["Approval_Status"]))
      ) {
        return false
      }

      return true
    })
    const start = (page - 1) * size
    const end = start + size
    setTotalItems(filteredValues?.length)
    setFilterData(filteredValues.slice(start, end))
  }, [filters, data, page, size])

  useEffect(() => {
    getFilterData()
  }, [getFilterData])

  const loadDefaultCsv = useCallback(
    async (signal: AbortSignal) => {
      const csvPath = `${import.meta.env.BASE_URL}files/uae_capex_opex_dashboard.csv`
      try {
        const res = await fetch(csvPath, { signal })
        if (!res.ok) return
        const blob = await res.blob()
        if (signal.aborted) return
        const defaultFile = new File([blob], "uae_capex_opex_dashboard.csv", {
          type: blob.type || "text/csv",
        })
        const fileData = await readFile(defaultFile)
        if (signal.aborted) return
        const files = fileData as unknown as ISheetsData[]
        setData(files)
        getFilterOptions(files)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    },
    [readFile, getFilterOptions],
  )

  useEffect(() => {
    const controller = new AbortController()
    void loadDefaultCsv(controller.signal)
    return () => controller.abort()
  }, [loadDefaultCsv])

  const onChooseFile = async (file?: File) => {
    if (!file) {
      return
    }
    setLoading(true)
    const fileData = await readFile(file)
    const files = fileData as unknown as ISheetsData[]
    setData(files)
    getFilterOptions(files)
    setFilterData(files.slice(0, size))
    setLoading(false)
  }

  const onClickFile = () => openFile(onChooseFile)

  return (
    <>
      {loading ? (
        <SpinningLoader />
      ) : data?.length === 0 ? (
        <EmptyOutline onChooseFile={onClickFile} />
      ) : (
        <div className="flex flex-col gap-4">
          <MenuTabs view={view} onChangeView={onChangeView} />
          {view === "list" ? (
            <>
              <FilterList
                filters={filters}
                onChangeFilterVal={onChangeFilterVal}
                options={options}
                resetFn={resetFn}
              />
              <TableUI
                data={filteredData}
                goNext={goNext}
                goPrev={goPrev}
                goTo={goTo}
                pageNo={page}
                size={size}
                totalItems={totalItems}
                onChangeSize={onChangeSize}
              />
            </>
          ) : (
            <ChartsView data={data} />
          )}
        </div>
      )}
    </>
  )
}

export default Main

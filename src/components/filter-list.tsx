import SearchInput from "./search-input"
import MultiSelectInput from "./multi-select-input"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import type { IFilterOptions, IFilters } from "@/interfaces/app.interface"

interface IFilerListProps {
  filters: IFilters
  options: IFilterOptions
  onChangeFilterVal: (key: string, value: string[] | string | null) => void
  resetFn: () => void
}

const FilterList = ({
  filters,
  options,
  onChangeFilterVal,
  resetFn,
}: IFilerListProps) => {
  return (
    <Card className="grid grid-cols-1 items-center gap-4 p-3 sm:grid-cols-2 md:grid-cols-4">
      {/* Search */}
      <SearchInput
        searchVal={filters.search}
        onChangeSearch={(val: string) => onChangeFilterVal("search", val)}
      />
      {/* Companies */}
      <MultiSelectInput
        options={options?.Company_Name}
        placeholder="Select companies"
        selected={filters?.Company_Name}
        onChooseOptions={(val: string[] | null) =>
          onChangeFilterVal("Company_Name", val)
        }
      />
      {/* Department */}
      <MultiSelectInput
        options={options?.Department}
        placeholder="Select department"
        selected={filters.Department}
        onChooseOptions={(val: string[] | null) =>
          onChangeFilterVal("Department", val)
        }
      />
      {/* Priority */}
      <MultiSelectInput
        options={options?.Expense_Type}
        placeholder="Select Expense Type"
        selected={filters.Expense_Type}
        onChooseOptions={(val: string[] | null) =>
          onChangeFilterVal("Expense_Type", val)
        }
      />
      {/* Priority */}
      <MultiSelectInput
        options={options?.Priority}
        placeholder="Select Priority"
        selected={filters.Priority}
        onChooseOptions={(val: string[] | null) =>
          onChangeFilterVal("Priority", val)
        }
      />
      {/* Status */}
      <MultiSelectInput
        options={options?.Status}
        placeholder="Select status"
        selected={filters.Status}
        onChooseOptions={(val: string[] | null) =>
          onChangeFilterVal("Status", val)
        }
      />
      {/* Approved status */}
      <MultiSelectInput
        options={options?.Approval_Status}
        placeholder="Select approved status"
        selected={filters.Approval_Status}
        onChooseOptions={(val: string[] | null) =>
          onChangeFilterVal("Approval_Status", val)
        }
      />
      <Button
        type="button"
        variant="secondary"
        onClick={resetFn}
      >
        Reset
      </Button>
    </Card>
  )
}

export default FilterList

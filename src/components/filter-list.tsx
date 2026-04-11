import SearchInput from "./search-input"
// import SelectInput from "./select-input"
import MultiSelectInput from "./multi-select-input"
import { Card } from "./ui/card"
import type { IFilterOptions, IFilters } from "@/interfaces/app.interface"

interface IFilerListProps {
  filters: IFilters
  options: IFilterOptions
  onChangeFilterVal: (key: string, value: string[] | string | null) => void
}

const FilterList = ({
  filters,
  options,
  onChangeFilterVal,
}: IFilerListProps) => {
  return (
    <Card className="grid grid-cols-4 items-center gap-4 p-3">
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
    </Card>
  )
}

export default FilterList

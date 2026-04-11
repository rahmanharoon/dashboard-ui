interface IFilters {
  search: string
  Company_Name: string[] | null
  Department: string[] | null
  Priority: string[] | null
  Expense_Type: string[] | null
  Status: string[] | null
  Approval_Status: string[] | null
}

interface IFilterOptions {
  Company_Name: string[]
  Department: string[]
  Priority: string[]
  Expense_Type: string[]
  Status: string[]
  Approval_Status: string[]
}

export type ISheetsData = Record<string, string | number>

export type { IFilters, IFilterOptions }

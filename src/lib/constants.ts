const pageOptions = [10, 25, 50, 100]

const defaultFilterValues = {
  search: "",
  status: "all",
  priority: "all",
}

const defaultPaginationValues = {
  size: 25,
  pageNo: 1,
}

const defaultFilters = {
  search: "",
  Company_Name: null,
  Department: null,
  Priority: null,
  Expense_Type: null,
  Status: null,
  Approval_Status: null,
}

const defaultOptions = {
  Company_Name: [],
  Department: [],
  Priority: [],
  Expense_Type: [],
  Status: [],
  Approval_Status: [],
}

const tableHeaders = {
  Company_Name: "Company",
  Owner: "Owner",
  Region: "Region",
  Department: "Department",
  Business_Unit: "Business Unit",
  Initiative: "Initiative",
  Expense_Type: "Expense Type",
  Year: "Year",
  Quarter: "Quarter",
  Priority: "Priority",
  Estimated_Budget_AED: "Estimated Budget",
  Actual_Budget_AED: "Actual Budget",
  Delta_AED: "Delta",
  Status: "Status",
  Approval_Status: "Approval Status",
}

export {
  defaultOptions,
  defaultFilters,
  tableHeaders,
  pageOptions,
  defaultFilterValues,
  defaultPaginationValues,
}

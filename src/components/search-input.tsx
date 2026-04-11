import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ISearchProps {
  searchVal: string
  onChangeSearch: (val: string) => void
}

const SearchInput = ({ onChangeSearch, searchVal }: ISearchProps) => {
  return (
    <Field orientation="horizontal">
      <Input
        type="search"
        value={searchVal}
        onChange={(e) => {
          e.preventDefault()
          const value = e.target.value
          onChangeSearch(value)
        }}
        placeholder="Search..."
      />
    </Field>
  )
}

export default SearchInput

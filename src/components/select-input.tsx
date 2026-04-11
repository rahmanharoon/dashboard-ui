"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface ISelectProps {
  options: string[]
  selected: string
  placeholder: string
  onChangeOption: (value: string | null) => void
}

const SelectInput = ({
  options,
  placeholder,
  onChangeOption,
  selected,
}: ISelectProps) => {
  return (
    <Combobox items={options} value={selected} onValueChange={onChangeOption}>
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default SelectInput

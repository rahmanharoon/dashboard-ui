export const useFilePicker = () => {
  const openFile = (onChange: (file?: File) => void, accept?: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept ?? ".csv,.xlsx"
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      onChange?.(file)
    }
    input.click()
  }

  return { openFile }
}

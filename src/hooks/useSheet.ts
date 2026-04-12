import { useCallback } from "react"
import { read, utils } from "xlsx"

export const useSheet = () => {
  const readFile = useCallback(async (file: File) => {
    const extracted = await file.arrayBuffer()
    const fileRead = read(extracted, { type: "array" })

    const sheetValue = fileRead.SheetNames.flatMap((name) => {
      const sheet = fileRead.Sheets[name]
      return utils.sheet_to_json(sheet, { defval: "" })
    })

    return sheetValue
  }, [])

  return { readFile }
}

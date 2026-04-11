import { useMemo } from "react"

const getPaginationRange = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const left = Math.max(2, currentPage - 1)
  const right = Math.min(totalPages - 1, currentPage + 1)

  const showLeftDots = left > 2
  const showRightDots = right < totalPages - 1

  const range: (number | "...")[] = [1]
  if (showLeftDots) range.push("...")
  for (let i = left; i <= right; i++) range.push(i)
  if (showRightDots) range.push("...")
  range.push(totalPages)

  return range
}

export const usePagination = ({
  pageNo,
  size,
  totalItems,
}: {
  totalItems: number
  pageNo: number
  size: number
}) => {
  const totalPages = Math.ceil(totalItems / size)

  const range = useMemo(
    () => getPaginationRange(pageNo, totalPages),
    [pageNo, totalPages]
  )

  return {
    range,
    totalPages,
    canNext: pageNo < totalPages,
    canPrev: pageNo > 1,
  }
}

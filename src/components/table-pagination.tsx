import { memo } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePagination } from "@/hooks/usePagination"
import { pageOptions } from "@/lib/constants"

interface ITableProps {
  totalItems: number
  pageNo: number
  size: number
  goTo: (page: number, totalItems: number) => void
  goNext: (totalItems: number) => void
  goPrev: (totalItems: number) => void
  onChangeSize: (size: number) => void
}

const TablePagination = ({
  pageNo,
  size,
  totalItems,
  goNext,
  goPrev,
  goTo,
  onChangeSize,
}: ITableProps) => {
  const { range, canNext, canPrev } = usePagination({
    pageNo,
    size,
    totalItems,
  })
  const onClickPrev = () => goPrev(totalItems)
  const onClickNext = () => goNext(totalItems)

  return (
    <Pagination className="justify-end">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          onValueChange={(value) => onChangeSize(Number(value))}
          value={`${size}`}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {pageOptions?.map((pageSize) => (
                <SelectItem value={`${pageSize}`} key={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onClickPrev}
            aria-disabled={!canPrev}
            className={
              !canPrev ? "pointer-events-none opacity-40" : "cursor-pointer"
            }
          />
        </PaginationItem>

        {range.map((item) => (
          <PaginationItem key={item}>
            {item === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={item === pageNo}
                onClick={() => goTo(item, totalItems)}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={onClickNext}
            aria-disabled={!canNext}
            className={
              !canNext ? "pointer-events-none opacity-40" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default memo(TablePagination)

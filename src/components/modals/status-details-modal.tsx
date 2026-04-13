import type { ISheetsData } from "@/interfaces/app.interface"
import { ReusableDialog } from "./reusable-dialog"
import { ChartBarDefault } from "../charts/demo"

type StatusModalProps = {
  open: boolean
  status: string | null
  rows: ISheetsData[]
  onClose: () => void
}

export const StatusModal = ({
  open,
  status,
  rows,
  onClose,
}: StatusModalProps) => {
  const title =
    status != null && status !== ""
      ? `${status} Status details`
      : "Status details"

  const renderContent =
    status === null ? (
      <></>
    ) : (
      // <div className="overflow-x-auto">
      //   <TableUI
      //     data={pageData}
      //     goNext={goNext}
      //     goPrev={goPrev}
      //     goTo={goTo}
      //     pageNo={page}
      //     size={size}
      //     totalItems={totalItems}
      //     onChangeSize={onChangeSize}
      //   />
      // </div>
      <ChartBarDefault status={status} data={rows} />
    )

  return (
    <ReusableDialog
      content={renderContent}
      open={open && status != null}
      closeModal={onClose}
      title={title}
      className="flex w-[min(96vw,72rem)] max-w-[min(96vw,72rem)] flex-col gap-0 p-0 sm:max-w-[min(96vw,72rem)]"
      contentClassName="px-2 py-3 sm:px-4"
    />
  )
}

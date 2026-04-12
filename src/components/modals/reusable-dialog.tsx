import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type ReusableDialogProps = {
  open: boolean
  closeModal: () => void
  title: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
} & Omit<
  React.ComponentProps<typeof DialogContent>,
  "children" | "showCloseButton" | "content"
>

const ReusableDialog = ({
  open,
  closeModal,
  title,
  content,
  footer,
  className,
  contentClassName,
  ...contentProps
}: ReusableDialogProps) => (
  <Dialog
    open={open}
    onOpenChange={(nextOpen) => {
      if (!nextOpen) closeModal()
    }}
  >
    <DialogContent
      showCloseButton
      className={cn(
        "flex max-h-[min(90vh,36rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg",
        className,
      )}
      {...contentProps}
    >
      <DialogHeader className="shrink-0 border-b border-border px-4 pt-4 pb-3">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4",
          contentClassName,
        )}
      >
        {content}
      </div>
      {footer != null ? (
        <DialogFooter className="shrink-0">{footer}</DialogFooter>
      ) : null}
    </DialogContent>
  </Dialog>
)

export { ReusableDialog }

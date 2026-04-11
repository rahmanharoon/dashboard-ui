import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Sheet, Upload } from "lucide-react"
import { memo } from "react"

interface IEmptyProps {
  onChooseFile: () => void
}

const EmptyOutline = memo(({ onChooseFile }: IEmptyProps) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-h-min min-h-max w-[80%] sm:w-[60%]">
        <Empty className="justify-center self-center border border-dashed bg-gray-50 dark:bg-gray-950">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sheet />
            </EmptyMedia>
            <EmptyTitle>No Data Found</EmptyTitle>
            <EmptyDescription>
              Upload files to view the report.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onChooseFile} variant="outline" size="sm">
              <Upload />
              Upload Files
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
})

export { EmptyOutline }

import { File, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { memo } from "react"
import { formatFileSize } from "@/lib/utils"

interface IFileItemProps {
  file: File
  onChangeFile: () => void
}

const FileItem = ({ file, onChangeFile }: IFileItemProps) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <File />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{file?.name ?? ""}</ItemTitle>
          {file?.size ? (
            <ItemDescription>{formatFileSize(file?.size)}</ItemDescription>
          ) : null}
        </ItemContent>
        <ItemActions>
          <Button onClick={onChangeFile} size="sm" variant="outline">
            <Upload />
            Change File
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}

export default memo(FileItem)

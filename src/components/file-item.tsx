import { File, } from "lucide-react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { memo } from "react"
import { formatFileSize } from "@/lib/utils"

interface IFileItemProps {
  file: File
}

const FileItem = ({ file, }: IFileItemProps) => {
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
      </Item>
    </div>
  )
}

export default memo(FileItem)

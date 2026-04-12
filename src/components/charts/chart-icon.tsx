import { Label } from "../ui/label"

export type ChartIconProps = {
  title: string
  color: string
  onCardClick: () => void
}

export const ChartIcon = ({ title, color, onCardClick }: ChartIconProps) => (
  <button
    type="button"
    className="hover:bg-muted/60 flex cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2 py-1"
    onClick={onCardClick}
  >
    <div
      className="h-4 w-4 shrink-0 rounded-sm"
      style={{ backgroundColor: color }}
    />
    <Label className="cursor-pointer">{title}</Label>
  </button>
)

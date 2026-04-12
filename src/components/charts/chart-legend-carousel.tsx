import useEmblaCarousel from "embla-carousel-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type ChartLegendCarouselProps<T> = {
  items: readonly T[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  className?: string
  viewportClassName?: string
}

export function ChartLegendCarousel<T>({
  items,
  getKey,
  renderItem,
  className,
  viewportClassName,
}: ChartLegendCarouselProps<T>) {
  const [emblaRef] = useEmblaCarousel({
    axis: "x",
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  })

  if (items.length === 0) return null

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn("overflow-hidden", viewportClassName)}
        ref={emblaRef}
      >
        <div className="flex touch-pan-x gap-2">
          {items.map((item) => (
            <div key={getKey(item)} className="min-w-0 shrink-0">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

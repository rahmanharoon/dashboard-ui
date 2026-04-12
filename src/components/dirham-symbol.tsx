import {
  forwardRef,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react"

import { cn } from "@/lib/utils"

export const DirhamSymbol = forwardRef<
  HTMLSpanElement,
  PropsWithChildren<HTMLAttributes<HTMLSpanElement>>
>(({ children, className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("dirham-container", className)}
    {...props}
  >
    <span className="dirham-symbol">{"\uE000"}</span>
    {children}
  </span>
))
DirhamSymbol.displayName = "DirhamSymbol"

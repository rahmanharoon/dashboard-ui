import { memo } from "react"
import { Spinner } from "./ui/spinner"

const UISpinner = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

const SpinningLoader = memo(UISpinner)

export default SpinningLoader

import { Toaster } from "@/components/ui/sonner"
import Main from "./pages/Main"
import { ModeToggle } from "./components/mode-toggle"

export function App() {
  return (
    <div className="relative flex min-h-svh p-6">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="flex w-full flex-col gap-4">
        <Main />
        <Toaster />
      </div>
    </div>
  )
}

export default App

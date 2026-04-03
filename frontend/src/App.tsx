import { Button } from "./components/ui/button"

const App = () => {
  return (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <h1 className="text-4xl font-bold text-blue-600 tracking-tight">
      Welcome to <span className="text-indigo-600">VibeConnect..!</span>
    </h1>
    <Button className="flex ml-4 items-center justify-center" variant="outline">
      Get Started
    </Button>
  </div>
)
}

export default App

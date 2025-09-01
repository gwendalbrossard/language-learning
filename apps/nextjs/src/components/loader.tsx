import type { FC } from "react"
import { Loader2 } from "lucide-react"

const Loader: FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <Loader2 strokeWidth={1.5} className="text-primary-600 size-7 animate-spin" />
    </div>
  )
}

export default Loader

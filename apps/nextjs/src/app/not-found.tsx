"use client"

import { useRouter } from "next/navigation"
import { MoveLeftIcon } from "lucide-react"

import * as Button from "@acme/ui/button"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-medium">Not found</h2>
        <p className="text text-neutral-500">The resource you are looking for does not exist</p>
      </div>
      <Button.Root onClick={() => router.back()}>
        <Button.Icon>
          <MoveLeftIcon />
        </Button.Icon>
        <Button.Label>Go back</Button.Label>
      </Button.Root>
    </div>
  )
}

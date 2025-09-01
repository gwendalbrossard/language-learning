"use client"

import type { FC } from "react"

import * as Button from "@acme/ui/button"
import { toast } from "@acme/ui/toast"

import { authClient } from "~/auth/client"
import GoogleIcon from "~/components/svg/google"

const ContinueWithGoogle: FC = () => {
  const handleContinueWithGoogle = async () => {
    const res = await authClient.signIn.social({
      provider: "google",
    })

    if (res.error) {
      console.error(res.error)
      toast.error("An error occurred", "Please try again")
    } else {
      toast.success("Signed in", "You are now signed in")
    }
  }

  return (
    <Button.Root onClick={handleContinueWithGoogle} variant="secondary" size="lg" className="w-full">
      <Button.Icon position="start">
        <GoogleIcon />
      </Button.Icon>
      <Button.Label>Continue with Google</Button.Label>
    </Button.Root>
  )
}

export default ContinueWithGoogle

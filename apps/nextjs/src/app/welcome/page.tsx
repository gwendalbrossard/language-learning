import type { FC } from "react"
import { redirect } from "next/navigation"

import { api } from "~/trpc/server"
import Welcome from "./_components/welcome"

type Props = {
  children: React.ReactNode
}
const WelcomePage: FC<Props> = async () => {
  const authMe = await api.auth.me()

  if (!authMe.user) {
    return redirect("/signin")
  }

  if (authMe.profile) {
    return redirect("/dashboard")
  }

  return (
    <div className="container w-full max-w-[544px] sm:w-[544px]">
      <div className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-md">
        <Welcome authMe={authMe} />
      </div>
    </div>
  )
}

export default WelcomePage

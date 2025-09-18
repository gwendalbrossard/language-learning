import { Suspense } from "react"

import { HydrateClient, prefetch, trpc } from "~/trpc/server"
import { AuthShowcase } from "./_components/auth-showcase"
import { CreateRoleplaySessionForm, RoleplaySessionCardSkeleton, RoleplaySessionList } from "./_components/roleplay-sessions"

export default function HomePage() {
  prefetch(trpc.profile.roleplaySession.getAll.queryOptions({ organizationId: "1" }))

  return (
    <HydrateClient>
      <main className="container h-screen py-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-primary">T3</span> Turbo
          </h1>
          <AuthShowcase />

          <CreateRoleplaySessionForm />
          <div className="w-full max-w-2xl overflow-y-scroll">
            <Suspense
              fallback={
                <div className="flex w-full flex-col gap-4">
                  <RoleplaySessionCardSkeleton />
                  <RoleplaySessionCardSkeleton />
                </div>
              }
            >
              <RoleplaySessionList />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}

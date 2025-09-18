"use client"

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

import type { RouterOutputs } from "@acme/api"
import * as Button from "@acme/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, useForm } from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { cn } from "@acme/ui/lib/utils"
import { toast } from "@acme/ui/toast"
import { ZProfileRoleplaySessionCreateSchema } from "@acme/validators"

import { useTRPC } from "~/trpc/react"
import { mapErrorsZodToForm } from "~/utils/form"

export function CreateRoleplaySessionForm() {
  const trpc = useTRPC()
  const form = useForm({
    schema: ZProfileRoleplaySessionCreateSchema,
    defaultValues: {
      scenarioId: "",
      organizationId: "1",
    },
  })

  const queryClient = useQueryClient()
  const profileRoleplaySessionCreate = useMutation(
    trpc.profile.roleplaySession.create.mutationOptions({
      onSuccess: async () => {
        form.reset()
        await queryClient.invalidateQueries(trpc.profile.roleplaySession.pathFilter())
      },
      onError: (err) => {
        if (err.data?.zodError) {
          mapErrorsZodToForm(form.setError, err.data.zodError)
        } else {
          toast.error("An error occurred", err.message)
        }
      },
    }),
  )

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit((data) => {
          profileRoleplaySessionCreate.mutate(data)
        })}
      >
        <FormField
          control={form.control}
          name="scenarioId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Scenario ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organizationId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Organization ID" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button.Root type="submit">
          <Button.Label>Create Roleplay Session</Button.Label>
        </Button.Root>
      </form>
    </Form>
  )
}

export function RoleplaySessionList() {
  const trpc = useTRPC()
  const { data: roleplaySessions } = useSuspenseQuery(trpc.profile.roleplaySession.getAll.queryOptions({ organizationId: "1" }))

  if (roleplaySessions.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <RoleplaySessionCardSkeleton pulse={false} />
        <RoleplaySessionCardSkeleton pulse={false} />
        <RoleplaySessionCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No roleplay sessions yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {roleplaySessions.map((session) => {
        return <RoleplaySessionCard key={session.id} roleplaySession={session} />
      })}
    </div>
  )
}

export function RoleplaySessionCard(props: { roleplaySession: RouterOutputs["profile"]["roleplaySession"]["getAll"][number] }) {
  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="grow">
        <h2 className="text-primary text-2xl font-bold">{props.roleplaySession.scenario.title}</h2>
        <p className="mt-2 text-sm">{props.roleplaySession.scenario.description}</p>
        <p className="text-muted-foreground mt-1 text-xs">Duration: {props.roleplaySession.duration}s</p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">{props.roleplaySession.scenario.emoji}</span>
        <span className="text-muted-foreground text-xs">Difficulty: {props.roleplaySession.scenario.difficulty}</span>
      </div>
    </div>
  )
}

export function RoleplaySessionCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props
  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="grow">
        <h2 className={cn("bg-primary w-1/4 rounded text-2xl font-bold", pulse && "animate-pulse")}>&nbsp;</h2>
        <p className={cn("mt-2 w-1/3 rounded bg-current text-sm", pulse && "animate-pulse")}>&nbsp;</p>
      </div>
    </div>
  )
}

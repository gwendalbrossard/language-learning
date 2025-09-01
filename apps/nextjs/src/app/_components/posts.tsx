"use client"

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

import type { RouterOutputs } from "@acme/api"
import * as Button from "@acme/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, useForm } from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { cn } from "@acme/ui/lib/utils"
import { toast } from "@acme/ui/toast"
import { ZPostCreateSchema } from "@acme/validators"

import { useTRPC } from "~/trpc/react"
import { mapErrorsZodToForm } from "~/utils/form"

export function CreatePostForm() {
  const trpc = useTRPC()
  const form = useForm({
    schema: ZPostCreateSchema,
    defaultValues: {
      content: "",
      title: "",
    },
  })

  const queryClient = useQueryClient()
  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        form.reset()
        await queryClient.invalidateQueries(trpc.post.pathFilter())
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
          createPost.mutate(data)
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button.Root>
          <Button.Label>Create</Button.Label>
        </Button.Root>
      </form>
    </Form>
  )
}

export function PostList() {
  const trpc = useTRPC()
  const { data: posts } = useSuspenseQuery(trpc.post.all.queryOptions())

  if (posts.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />
      })}
    </div>
  )
}

export function PostCard(props: { post: RouterOutputs["post"]["all"][number] }) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const deletePost = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.post.pathFilter())
      },
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          toast.error("Unauthorized", "You must be logged in to delete a post")
        } else {
          toast.error("Failed to delete post", "Please try again")
        }
      },
    }),
  )

  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="grow">
        <h2 className="text-primary text-2xl font-bold">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <Button.Root variant="secondary" onClick={() => deletePost.mutate(props.post.id)}>
          <Button.Label>Delete</Button.Label>
        </Button.Root>
      </div>
    </div>
  )
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
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

"use client"

import type { FC } from "react"
import { useState } from "react"
import { z } from "zod/v4"

import * as Button from "@acme/ui/button"
import { useForm } from "@acme/ui/form"
import * as Form from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { toast } from "@acme/ui/toast"

import { authClient } from "~/auth/client"

export const ZSigninSchema = z.object({
  email: z.email(),
  password: z.string(),
})
export type TSigninSchema = z.infer<typeof ZSigninSchema>

const WithEmailPassword: FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    schema: ZSigninSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: TSigninSchema) => {
    setIsLoading(true)
    const res = await authClient.signIn
      .email({
        email: data.email,
        password: data.password,
      })
      .finally(() => setIsLoading(false))

    if (res.error) {
      console.error(res.error)
      switch (res.error.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
          form.setError("email", { message: "Invalid email or password" })
          form.setError("password", { message: "Invalid email or password" })
          break
        default:
          toast.error("An error occurred", "Please try again")
          break
      }
    } else {
      toast.success("Sign in successful", "You are now signed in")
    }
  }

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <Form.Field
          control={form.control}
          name="email"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Email</Form.Label>
              <Form.Control>
                <Input size="lg" id="mail" autoComplete="mail" type="email" placeholder="Enter your email" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="password"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Password</Form.Label>
              <Form.Control>
                <Input size="lg" id="password" autoComplete="password" type="password" placeholder="•••••••••••••" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Button.Root type="submit" size="lg" className="w-full" loading={isLoading}>
          <Button.Label>Sign In</Button.Label>
        </Button.Root>
      </form>
    </Form.Root>
  )
}

export default WithEmailPassword

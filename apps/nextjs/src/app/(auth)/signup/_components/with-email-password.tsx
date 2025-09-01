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

export const ZSignUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
})
export type TSignUpSchema = z.infer<typeof ZSignUpSchema>

const WithEmailPassword: FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    schema: ZSignUpSchema,
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  const onSubmit = async (data: TSignUpSchema) => {
    setIsLoading(true)
    const res = await authClient.signUp
      .email({
        email: data.email,
        password: data.password,
        name: "",
      })
      .finally(() => setIsLoading(false))

    if (res.error) {
      console.error(res.error)
      switch (res.error.code) {
        case "USER_ALREADY_EXISTS":
          form.setError("email", { message: "Email already in use" })
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

        <Form.Field
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control>
                <Input size="lg" id="password" autoComplete="password" type="password" placeholder="•••••••••••••" {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Button.Root type="submit" size="lg" className="w-full" loading={isLoading}>
          <Button.Label>Sign Up</Button.Label>
        </Button.Root>
      </form>
    </Form.Root>
  )
}

export default WithEmailPassword

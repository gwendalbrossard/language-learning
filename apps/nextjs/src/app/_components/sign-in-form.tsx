"use client"

import type { FC } from "react"
import { z } from "zod/v4"

import * as Button from "@acme/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { toast } from "@acme/ui/toast"

import { authClient } from "~/auth/client"

const ZSignInForm = z.object({
  email: z.email(),
  password: z.string().min(8),
})

const SignInForm: FC = () => {
  const form = useForm({
    schema: ZSignInForm,
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignIn = form.handleSubmit(async (data) => {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (res.error) {
      toast.error("Invalid credentials", "You have entered an invalid email or password")
    } else {
      toast.success("Sign in successful", "You are now signed in")
    }
  })

  const handleSignUp = form.handleSubmit(async (data) => {
    const res = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: "",
    })

    if (res.error) {
      toast.error("Sign up failed", "Unable to create account. Email might already be in use.")
    } else {
      toast.success("Sign up successful", "Your account has been created and you are now signed in")
    }
  })

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button.Root type="button" onClick={handleSignIn} className="flex-1">
              <Button.Label>Sign in</Button.Label>
            </Button.Root>
            <Button.Root type="button" variant="secondary" onClick={handleSignUp} className="flex-1">
              <Button.Label>Sign up</Button.Label>
            </Button.Root>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SignInForm

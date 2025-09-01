"use client"

import type { FC, FormEvent } from "react"
import type { FileRejection } from "react-dropzone"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight, MoveLeft, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

import type { RouterOutputs } from "@acme/api"
import type { TProfileCreateSchema } from "@acme/validators"
import * as Button from "@acme/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { Label } from "@acme/ui/label"
import { toast } from "@acme/ui/toast"
import { ZProfileCreateSchema } from "@acme/validators"

import { FileDrop, FileDropIcon } from "~/components/file-drop"
import { useTRPC } from "~/trpc/react"
import { mapErrorsZodToForm } from "~/utils/form"

type Props = {
  authMe: RouterOutputs["auth"]["me"]
}
type Step = "user" | "organization"

const Welcome: FC<Props> = ({ authMe }) => {
  const router = useRouter()
  const [step, setStep] = useState<Step>("user")

  const [file, setFile] = useState<File | undefined>(undefined)
  const [fileError, setFileError] = useState<string | undefined>(undefined)
  const dropzone = useDropzone({
    onDropAccepted: (file) => handleDropZoneAccepted(file),
    onDropRejected: (fileRejections) => handleDropZoneRejected(fileRejections),
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    maxSize: 5 * 1000 * 1000,
    multiple: false,
  })

  const trpc = useTRPC()
  const profileCreate = useMutation(
    trpc.profile.create.mutationOptions({
      onSuccess: async (data) => {
        if (file) {
          await organizationUploadLogo.mutateAsync({ organizationId: data.organization.id, name: file.name, contentType: file.type })
        }

        toast.success("Account created !", "Your account has been created.")
        router.push("/")
      },
      onError: (err) => {
        if (err.data?.zodError) {
          mapErrorsZodToForm(form.setError, err.data.zodError)
        } else {
          toast.error("An error occurred.", err.message || "An error occurred.")
        }
      },
    }),
  )

  const organizationUploadLogo = useMutation(
    trpc.organization.uploadLogo.mutationOptions({
      onSuccess: async (data, variables) => {
        if (!file) return

        const uploadFile = await fetch(data.url, {
          method: "PUT",
          body: file,
        })

        if (!uploadFile.ok) {
          toast.error("An error occurred.", "An error occurred while uploading the logo.")
        } else {
          await organizationUpdate.mutateAsync({
            organizationId: variables.organizationId,
            logoR2Key: data.key,
            name: form.getValues("organizationName"),
          })
        }
      },
      onError: (error) => {
        toast.error("An error occurred.", error.message || "An error occurred.")
      },
    }),
  )

  const organizationUpdate = useMutation(
    trpc.organization.update.mutationOptions({
      onError: (error) => {
        toast.error("An error occurred.", error.message || "An error occurred.")
      },
    }),
  )

  const form = useForm({
    defaultValues: {
      name: "",
      avatar: authMe.user?.image,
      organizationName: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    mode: "all",
    schema: ZProfileCreateSchema,
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (step === "user") {
      await form.trigger("name")

      if (areUserValuesErrors) return

      setStep("organization")

      return
    }

    await form.handleSubmit(onSubmit)()
  }

  async function onSubmit(data: TProfileCreateSchema) {
    await profileCreate.mutateAsync(data)
  }

  const handleDropZoneAccepted = <T extends File>(files: T[]) => {
    if (!files[0]) return

    const reader = new FileReader()
    reader.onabort = () => setFileError("File upload cancelled")
    reader.onerror = () => setFileError("File upload error")
    reader.readAsDataURL(files[0])

    setFile(files[0])
    setFileError(undefined)
  }

  const handleDropZoneRejected = (fileRejections: FileRejection[]) => {
    if (!fileRejections[0]) return
    if (!fileRejections[0].errors[0]) return

    const error = fileRejections[0].errors[0]

    switch (error.code) {
      case "file-invalid-type":
        setFileError("Invalid file type.")
        break
      case "file-too-large":
        setFileError("File too large. Max 50MB")
        break
      default:
        break
    }
  }

  const areUserValuesEmpty = form.getValues("name") === ""
  const areUserValuesErrors = !!form.formState.errors.name
  const isContinueDisabled = areUserValuesEmpty || areUserValuesErrors

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="w-full">
          {step === "user" && (
            <div className="space-y-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">Welcome to Acme !</h1>
                <p className="text-neutral-500">Please fill in the information to complete your profile.</p>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input autoFocus size="lg" type="text" placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button.Root type="submit" disabled={isContinueDisabled} loading={profileCreate.status === "pending"} size="lg" className="w-full">
                  <Button.Label>Continue</Button.Label>
                  <Button.Icon position="end">
                    <ArrowRight />
                  </Button.Icon>
                </Button.Root>
              </div>
            </div>
          )}

          {step === "organization" && (
            <div className="space-y-8">
              <button
                onClick={() => setStep("user")}
                type="button"
                className="flex h-fit items-center text-sm text-gray-400 transition hover:text-gray-600"
              >
                <MoveLeft className="mr-2 h-4 w-4" /> Back
              </button>

              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold">Organization</h1>
                <p className="text-neutral-500">Your organization will be the place where you can share resources between your team members.</p>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input autoFocus size="lg" type="text" placeholder="Acmee Corp." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Label>
                    Logo <span className="text-sm text-gray-400">(optional)</span>
                  </Label>
                  <div className="flex items-center">
                    {file ? (
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg object-cover after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-neutral-900/10 after:ring-inset">
                        <Image src={URL.createObjectURL(file)} alt="Organization logo" fill />
                      </div>
                    ) : (
                      <FileDrop {...dropzone} data-invalid={!!fileError} size="sm">
                        <FileDropIcon children={<Upload />} />
                      </FileDrop>
                    )}
                    <div className="ml-5 space-y-1">
                      <div className="flex gap-2">
                        <Button.Root variant="secondary" size="xs" onClick={() => dropzone.inputRef.current.click()} type="button">
                          <Button.Label>Upload</Button.Label>
                        </Button.Root>
                        {file && (
                          <Button.Root
                            variant="destructive"
                            size="xs"
                            onClick={() => {
                              setFile(undefined)
                              setFileError(undefined)
                            }}
                            type="button"
                          >
                            <Button.Label>Delete</Button.Label>
                          </Button.Root>
                        )}
                      </div>
                      <p className="ml-0.5 text-sm text-neutral-500">Use a square image. Maximum size: 5MB.</p>
                    </div>
                  </div>

                  {fileError && <p className="text-sm text-red-600">{fileError}</p>}
                </div>

                <Button.Root
                  type="submit"
                  disabled={isContinueDisabled || profileCreate.status === "pending"}
                  loading={profileCreate.status === "pending"}
                  size="lg"
                  className="w-full"
                >
                  <Button.Label>Finish</Button.Label>
                </Button.Root>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}

export default Welcome

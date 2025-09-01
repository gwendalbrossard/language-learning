"use client"

import type { FC } from "react"
import type { FileRejection } from "react-dropzone"
import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"

import type { TOrganizationCreateSchema } from "@acme/validators"
import { Button } from "@acme/ui/button"
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@acme/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@acme/ui/form"
import { Input } from "@acme/ui/input"
import { Label } from "@acme/ui/label"
import { toast } from "@acme/ui/toast"
import { ZOrganizationCreateSchema } from "@acme/validators"

import { FileDrop, FileDropIcon } from "~/components/file-drop"
import { useTRPC } from "~/trpc/react"
import { mapErrorsZodToForm } from "~/utils/form"
import { useDashboardContext } from "~/utils/zustand/dashboard-store"
import { useSidebar } from "./sidebar"

const CreateOrganizationDialog: FC = () => {
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

  const { createOrganizationDialogOpen, setCreateOrganizationDialogOpen } = useSidebar()
  const updateCurrentOrganizationId = useDashboardContext((state) => state.updateCurrentOrganizationId)

  const form = useForm<TOrganizationCreateSchema>({
    defaultValues: {
      name: "",
    },
    mode: "all",
    resolver: zodResolver(ZOrganizationCreateSchema),
  })

  const trpc = useTRPC()
  // const utils = trpc.useUtils()
  const organizationCreate = useMutation(
    trpc.organization.create.mutationOptions({
      onSuccess: async (data) => {
        if (file) {
          await organizationUploadLogo.mutateAsync({ organizationId: data.id, name: file.name, contentType: file.type })
        }

        //     await utils.organization.me.invalidate()
        updateCurrentOrganizationId(data.id)
        toast.success("Organization created !", "Your organization has been created !")
        setCreateOrganizationDialogOpen(false)
      },
      onError: (error) => {
        console.error(error)
        if (error.data?.zodError) {
          mapErrorsZodToForm(form.setError, error.data.zodError)
        } else {
          toast.error("An error occurred.", error.message || "An error occurred.")
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
            name: form.getValues("name"),
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

  const onSubmit = async (data: TOrganizationCreateSchema) => {
    await organizationCreate.mutateAsync(data)
  }

  const handleDropZoneAccepted = <T extends File>(files: T[]) => {
    if (!files[0]) return

    const reader = new FileReader()
    reader.onabort = () => setFileError("Upload de fichier annulé")
    reader.onerror = () => setFileError("Upload de fichier annulé")
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
        setFileError("Type de fichier invalide.")
        break
      case "file-too-large":
        setFileError("Fichier trop grand. Max 50MB")
        break
      default:
        break
    }
  }

  const handleOnCloseAutoFocus = () => {
    form.reset()
    setFile(undefined)
    setFileError(undefined)
  }

  return (
    <Dialog open={createOrganizationDialogOpen} onOpenChange={setCreateOrganizationDialogOpen}>
      <DialogContent onCloseAutoFocus={handleOnCloseAutoFocus}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create organization</DialogTitle>
              <DialogDescription>
                Please fill in the necessary information to configure your new organization. You can always make adjustments later.
              </DialogDescription>
            </DialogHeader>

            <DialogBody className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoFocus size="sm" placeholder="Acmee Corp." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center">
                  {file ? (
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg object-cover after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-neutral-900/10 after:ring-inset">
                      <Image src={URL.createObjectURL(file)} alt="Organization logo" fill />
                    </div>
                  ) : (
                    <FileDrop {...dropzone} data-invalid={!!fileError} size="sm">
                      <FileDropIcon children={<Upload />} />
                    </FileDrop>
                  )}
                  <div className="ml-4 space-y-1">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="xxs" onClick={() => dropzone.inputRef.current.click()} type="button">
                        Select a file
                      </Button>
                      {file && (
                        <Button
                          variant="destructive"
                          size="xxs"
                          onClick={() => {
                            setFile(undefined)
                            setFileError(undefined)
                          }}
                          type="button"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    <p className="ml-0.5 text-xs text-neutral-500">Use a square image. Maximum size: 5MB.</p>
                  </div>
                </div>

                {fileError && <p className="text-sm text-red-600">{fileError}</p>}
              </div>
            </DialogBody>

            <DialogFooter>
              <Button type="submit" size="sm" className="w-full sm:w-fit" loading={organizationCreate.isPending}>
                Create organization
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrganizationDialog

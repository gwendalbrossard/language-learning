import type { FC } from "react"
import { useRouter } from "expo-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, useForm } from "react-hook-form"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import type { TProfileCreateSchema } from "@acme/validators"
import { ZProfileCreateSchema } from "@acme/validators"

import * as Step from "~/components/common/step"
import * as Button from "~/ui/button"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import { Text, TextError } from "~/ui/text"
import { queryClient, trpc } from "~/utils/api"
import { authClient } from "~/utils/auth"

const CreateProfile: FC = () => {
  const router = useRouter()

  const defaultValues: TProfileCreateSchema = {
    name: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatar: null,
    organizationName: "Organization",
  }

  const form = useForm<TProfileCreateSchema>({
    defaultValues: defaultValues,
    mode: "all",
    resolver: zodResolver(ZProfileCreateSchema),
  })

  const profileCreate = useMutation(
    trpc.profile.create.mutationOptions({
      onSuccess: async () => {
        await Promise.all([queryClient.prefetchQuery(trpc.profile.me.queryOptions()), queryClient.prefetchQuery(trpc.organization.me.queryOptions())])
        router.replace("/onboarding")
      },
    }),
  )

  const handleNext = () => {
    void form.handleSubmit(async (data) => await profileCreate.mutateAsync(data))()
  }

  return (
    <FormProvider {...form}>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: "white" }}>
        <Step.Container>
          <Step.Progress
            onBack={async () => {
              await queryClient.invalidateQueries(trpc.profile.me.queryFilter())
              await authClient.signOut()
              router.replace("/landing")
            }}
            progress={0}
          />
          <Step.Header>
            <Step.HeaderTitle>What's your name?</Step.HeaderTitle>
            <Step.HeaderDescription>Or tell us what you'd like to be called.</Step.HeaderDescription>
          </Step.Header>

          <Step.Body>
            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  invalid={!!form.formState.errors.name}
                  autoFocus
                  placeholder="Emily"
                  value={form.watch("name")}
                  onChangeText={(text) => form.setValue("name", text)}
                />
                {form.formState.errors.name && <TextError>{form.formState.errors.name.message}</TextError>}
              </View>

              <Text className="text-sm italic text-neutral-500">
                You'll stay completely anonymous — your name won't be visible to others.{"\n"}This helps personalize your experience.
              </Text>
            </View>
          </Step.Body>

          <Step.Bottom>
            <Button.Root
              onPress={handleNext}
              size="lg"
              variant="primary"
              className="w-full"
              disabled={!form.watch("name") || profileCreate.isPending}
              loading={profileCreate.isPending}
            >
              <Button.Text>Continue</Button.Text>
            </Button.Root>
          </Step.Bottom>
        </Step.Container>
      </SafeAreaView>
    </FormProvider>
  )
}

export default CreateProfile

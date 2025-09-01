import type { PrismaClient, ProfileSelected } from "@acme/db"
import type { TProfileOnboardSchema } from "@acme/validators"
import { profileSelect } from "@acme/db"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"
import { ZProfileOnboardSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"
import { posthogNodeCapture } from "../../utils/posthog"

export const onboard = profileProcedure.input(ZProfileOnboardSchema).mutation(async ({ ctx, input }) => {
  const { profile } = ctx

  const updatedProfile = await onboardingTransaction({ prisma: ctx.db, profile: profile, input: input })

  return updatedProfile
})

type OnboardingTransactionProps = {
  prisma: PrismaClient
  profile: ProfileSelected
  input: TProfileOnboardSchema
}
export const onboardingTransaction = async (props: OnboardingTransactionProps): Promise<ProfileSelected> => {
  const { prisma, profile, input } = props

  const updatedProfile = await prisma.$transaction(async (tx) => {
    // Add default stuff here
    const txUpdatedProfile = await tx.profile.update({
      where: { id: profile.id },
      data: {
        completedOnboarding: true,
        metadata: {
          onboarding: input,
        },
      },
      select: profileSelect,
    })

    return txUpdatedProfile
  })

  await posthogNodeCapture({
    distinctId: profile.id,
    event: POSTHOG_EVENTS["profile onboard"],
    properties: {
      profile: {
        id: profile.id,
        email: profile.email,
      },
      onboarding: {
        ...input,
      },
    },
  })

  return updatedProfile
}

import type { PrismaClient, ProfileSelected } from "@acme/db"
import type { TProfileOnboardSchema } from "@acme/validators"
import { profileSelect } from "@acme/db"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"
import { ZProfileOnboardSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"
import { posthogNodeCapture } from "../../utils/posthog"

export const onboard = profileProcedure.input(ZProfileOnboardSchema).mutation(async ({ ctx, input }) => {
  const updatedProfile = await onboardingTransaction({ prisma: ctx.db, profile: ctx.profile, input: input })

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
    const txUpdatedProfile = await tx.profile.update({
      where: { id: profile.id },
      data: {
        completedOnboarding: true,
        learningLanguage: input.learningLanguage,
        learningLanguageLevel: input.learningLanguageLevel,
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

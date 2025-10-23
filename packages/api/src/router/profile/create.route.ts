import { TRPCError } from "@trpc/server"

import type { OrganizationSelected, PrismaClient, ProfileSelected, UserSelected } from "@acme/db"
import type { TProfileCreateSchema } from "@acme/validators"
import { MemberRole, organizationSelect, profileSelect } from "@acme/db"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"
import { ZProfileCreateSchema } from "@acme/validators"

import { userProcedure } from "../../trpc"
import { posthogNodeCapture } from "../../utils/posthog"
import { generateUniqueOrganizationSlug } from "../organization/create.route"

export const create = userProcedure.input(ZProfileCreateSchema).mutation(async ({ ctx, input }) => {
  const profile = await ctx.db.profile.findFirst({
    where: { OR: [{ id: ctx.user.id }, { email: ctx.user.email }] },
    select: profileSelect,
  })
  if (profile) throw new TRPCError({ code: "UNAUTHORIZED", message: "Profile already exists with this id or email" })

  const { createdProfile, createdOrganization } = await createProfile({ user: ctx.user, profileCreateInput: input, db: ctx.db })

  return { profile: createdProfile, organization: createdOrganization }
})

type CreateProfileProps = {
  user: UserSelected
  profileCreateInput: TProfileCreateSchema
  db: PrismaClient
}

type CreateProfileReturn = {
  createdProfile: ProfileSelected
  createdOrganization: OrganizationSelected
}

export const createProfile = async (props: CreateProfileProps): Promise<CreateProfileReturn> => {
  const [createdProfile, createdOrganization] = await props.db.$transaction(async (tx) => {
    // First create the profile
    const profile = await tx.profile.create({
      data: {
        userId: props.user.id,
        email: props.user.email,
        name: props.profileCreateInput.name,
        timezone: props.profileCreateInput.timezone,
        metadata: {},
      },
      select: profileSelect,
    })

    // Then create the organization with the profile's ID
    const slug = await generateUniqueOrganizationSlug(props.profileCreateInput.organizationName, props.db)

    const organization = await tx.organization.create({
      data: {
        name: props.profileCreateInput.organizationName,
        slug: slug,
        members: { createMany: { data: [{ role: MemberRole.ADMIN, profileId: profile.id }] } },
        metadata: {},
      },
      select: organizationSelect,
    })

    return [profile, organization]
  })

  await posthogNodeCapture({
    distinctId: createdProfile.id,
    event: POSTHOG_EVENTS["profile created"],
    properties: {
      profile: createdProfile,
      organization: createdOrganization,
    },
  })

  return { createdProfile: createdProfile, createdOrganization: createdOrganization }
}

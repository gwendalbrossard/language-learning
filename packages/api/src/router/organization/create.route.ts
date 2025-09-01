import type { PrismaClient } from "@acme/db"
import { MemberRole, organizationSelect } from "@acme/db"
import { ZOrganizationCreateSchema } from "@acme/validators"

import { profileProcedure } from "../../trpc"

export const create = profileProcedure.input(ZOrganizationCreateSchema).mutation(async ({ ctx, input }) => {
  /* const organization = await ctx.db.organization.findUnique({ where: { slug: input.slug } })

  if (organization) {
    throw new TRPCError({
      cause: new ZodError([{ code: "custom", message: "Slug already exists.", path: ["slug"] }]),
      code: "BAD_REQUEST",
    })
  } */

  const slug = await generateUniqueOrganizationSlug(input.name, ctx.db)
  const createdOganization = await ctx.db.organization.create({
    data: {
      name: input.name,
      slug: slug,
      members: { createMany: { data: [{ role: MemberRole.ADMIN, profileId: ctx.profile.id }] } },
      metadata: {},
    },
    select: organizationSelect,
  })

  return createdOganization
})

export const generateUniqueOrganizationSlug = async (organizationName: string, db: PrismaClient): Promise<string> => {
  const slug = slugify(organizationName)

  const organization = await db.organization.findUnique({ where: { slug: slug } })
  if (organization) {
    return await generateUniqueOrganizationSlug(slug + "-" + generateRandomNumericString(5), db)
  }

  return slug
}

const slugify = (str: string) => {
  return str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both sides
    .normalize("NFD") // Normalize to decomposed form for handling accents
    .replace(/\p{Diacritic}/gu, "") // Remove any diacritics (accents) from characters
    .replace(/[^\p{L}\p{N}\p{Zs}\p{Emoji}]+/gu, "-") // Replace any non-alphanumeric characters (including Unicode) with a dash
    .replace(/[\s_]+/g, "-") // Replace whitespace and underscores with a single dash
    .replace(/^-+/, "") // Remove dashes from start
    .replace(/-+$/, "") // Remove dashes from end
}

const generateRandomNumericString = (length: number) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const randomNumbers = Array.from({ length }, () => numbers[Math.floor(Math.random() * numbers.length)])

  return randomNumbers.join("")
}

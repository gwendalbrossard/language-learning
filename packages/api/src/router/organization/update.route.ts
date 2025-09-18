import { DeleteObjectCommand, PutObjectAclCommand } from "@aws-sdk/client-s3"

import type { Prisma } from "@acme/db"
import { organizationSelect } from "@acme/db"
import { ZOrganizationUpdateSchema } from "@acme/validators"

import { env } from "../../env.server"
import { organizationProcedure } from "../../trpc"
import { r2Client } from "../../utils/cloudflare"

export const update = organizationProcedure.input(ZOrganizationUpdateSchema).mutation(async ({ ctx, input }) => {
  const { organization } = ctx

  let organizationUpdateData: Prisma.OrganizationUpdateArgs["data"] = { name: input.name }

  if (input.logoR2Key && organization.logo !== input.logoR2Key) {
    const putObjectAclCommand = new PutObjectAclCommand({
      Bucket: env.R2_BUCKET_PUBLIC,
      Key: input.logoR2Key,
    })
    await r2Client.send(putObjectAclCommand)

    if (organization.logo !== null) {
      const oldLogoKey = organization.logo.split(`https://${env.ASSETS_DOMAIN}/`)[1]
      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_PUBLIC,
        Key: oldLogoKey,
      })
      await r2Client.send(deleteObjectCommand)
    }

    organizationUpdateData = {
      ...organizationUpdateData,
      logo: `https://${env.ASSETS_DOMAIN}/${input.logoR2Key}`,
    }
  }

  const updatedOrganization = await ctx.db.organization.update({
    where: { id: organization.id },
    data: organizationUpdateData,
    select: organizationSelect,
  })

  return updatedOrganization
})

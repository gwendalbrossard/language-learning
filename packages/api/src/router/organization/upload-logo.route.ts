import { randomBytes } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { ZOrganizationUploadLogoSchema } from "@acme/validators"

import { env } from "../../env"
import { organizationProcedure } from "../../trpc"
import { r2Client } from "../../utils/cloudflare"

export const uploadLogo = organizationProcedure.input(ZOrganizationUploadLogoSchema).mutation(async ({ ctx, input }) => {
  const extension = input.name.split(".")[input.name.split(".").length - 1]
  const randomString = randomBytes(32).toString("hex") + "." + extension
  const key = `${ctx.organization.id}/logo-${randomString}`

  const putObjectCommand = new PutObjectCommand({
    Bucket: env.R2_BUCKET_PUBLIC,
    Key: key,
    ContentType: input.contentType,
  })
  const url = await getSignedUrl(r2Client, putObjectCommand, { expiresIn: 60 * 5 })

  return { url, key }
})

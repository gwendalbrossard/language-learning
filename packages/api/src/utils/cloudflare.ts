import * as stream from "stream"
import type { S3ClientConfig } from "@aws-sdk/client-s3"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"

import { env } from "../env"

const config: S3ClientConfig = {
  region: "auto",
  endpoint: `https://${env.R2_ENDPOINT_ID}.r2.cloudflarestorage.com/`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
}

export const r2Client = new S3Client({
  ...config,
})

export const downloadR2PrivateFileToBuffer = async (key: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: env.R2_BUCKET_PRIVATE,
    Key: key,
  })

  const response = await r2Client.send(getObjectCommand)

  if (!response.ContentLength) {
    throw new Error("Content length is not defined")
  }

  const byteSize = response.ContentLength

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []

    if (response.Body instanceof stream.Readable) {
      response.Body.on("data", (chunk: Buffer) => chunks.push(chunk))
      response.Body.on("end", () => resolve(Buffer.concat(chunks)))
      response.Body.on("error", reject)
    } else {
      reject(new Error("Response body is not a readable stream."))
    }
  })

  return { buffer, byteSize }
}

/* 
// Needs to be run once to update the CORS. Somehow it doesn't work in the cloudflare dashboard...

const response = await r2Client.send(
  new PutBucketCorsCommand({
    Bucket: env.R2_BUCKET_PUBLIC, //TODO: replace
    CORSConfiguration: {
      CORSRules: new Array({
        AllowedHeaders: ["content-type"], //this is important, do not use "*"
        AllowedMethods: ["GET", "PUT", "HEAD"],
        AllowedOrigins: ["*"],
        ExposeHeaders: [],
        MaxAgeSeconds: 60 * 5,
      }),
    },
  }),
) */

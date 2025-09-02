import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import type { Prisma } from "@acme/db"
import { prisma } from "@acme/db"

import type { Webhook } from "~/utils/revenuecat"
import { env } from "~/env.server"

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ statusCode: 405, message: "Method Not Allowed" })
  }

  const authorization = req.headers.get("Authorization")

  if (!authorization) {
    return NextResponse.json({ statusCode: 401, message: "Unauthorized: No authorization header" })
  }

  if (authorization !== env.REVENUECAT_WEBHOOK_SECRET) {
    return NextResponse.json({ statusCode: 401, message: "Unauthorized: Invalid authorization token" })
  }

  const body = (await req.json()) as Webhook

  const appUserId = body.event.app_user_id

  const customer = await fetch(`https://api.revenuecat.com/v2/projects/${env.REVENUECAT_PROJECT_ID}/customers/${appUserId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.REVENUECAT_API_KEY}`,
    },
  })

  const response = (await customer.json()) as Prisma.JsonObject
  console.log("--------------------------------")
  console.log(response)

  // Log the response headers
  console.log(customer.headers)

  if (customer.status !== 200) {
    console.error(response)
    return NextResponse.json({ statusCode: 500, message: "Failed to fetch customer" })
  }

  await prisma.profile.update({
    where: {
      id: appUserId,
    },
    data: {
      revenueCatCustomer: response,
    },
  })
  return NextResponse.json({ success: true })
}

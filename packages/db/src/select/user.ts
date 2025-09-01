import { Prisma } from "../../generated/client"

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  image: true,
})

export type UserSelected = Prisma.UserGetPayload<{ select: typeof userSelect }>

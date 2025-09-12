import { Prisma } from "../../generated/client"

export const roleplaySessionMessageSelect = Prisma.validator<Prisma.RoleplaySessionMessageSelect>()({
  id: true,
  role: true,
  content: true,
  feedback: true,
  createdAt: true,
  updatedAt: true,
})

export type RoleplaySessionMessageSelected = Prisma.RoleplaySessionMessageGetPayload<{ select: typeof roleplaySessionMessageSelect }>

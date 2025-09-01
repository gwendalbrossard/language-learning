import { Prisma } from "../../generated/client"
import { profileSelect } from "./profile"

export const memberSelect = Prisma.validator<Prisma.MemberSelect>()({
  id: true,
  role: true,
  profile: { select: profileSelect },
})

import { createTRPCRouter } from "../../trpc"
import { me } from "./me"

export const authRouter = createTRPCRouter({
  me: me,
})

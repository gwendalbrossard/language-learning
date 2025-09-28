import { authRouter } from "./router/auth/_router"
import { organizationRouter } from "./router/organization/_router"
import { profileRouter } from "./router/profile/_router"
import { userRouter } from "./router/user/_router"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  organization: organizationRouter,
  profile: profileRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.profile.roleplaySession.getAll();
 *       ^? RoleplaySession[]
 */
export const createCaller = createCallerFactory(appRouter)

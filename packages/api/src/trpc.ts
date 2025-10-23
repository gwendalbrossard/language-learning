/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { z, ZodError } from "zod/v4"

import type { Auth } from "@acme/auth"
import type { ProfileSelected, UserSelected } from "@acme/db"
import { organizationSelect, prisma, profileSelect, userSelect } from "@acme/db"
import { POSTHOG_EVENTS } from "@acme/shared/posthog"

import { posthogNodeCapture } from "./utils/posthog"
import { isUnlimited } from "./utils/revenuecat"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export const createTRPCContext = async (opts: { headers: Headers; auth: Auth }) => {
  const authApi = opts.auth.api
  const session = await authApi.getSession({
    headers: opts.headers,
  })

  let user: UserSelected | null = null
  let profile: ProfileSelected | null = null

  if (session) {
    const [prismaUser, prismaProfile] = await Promise.all([
      // TODO: Can be improved since session.user already contains the user
      prisma.user.findUnique({ where: { id: session.user.id }, select: userSelect }),
      prisma.profile.findUnique({ where: { userId: session.user.id }, select: profileSelect }),
    ])

    if (prismaUser) {
      user = prismaUser
    }

    if (prismaProfile) {
      profile = prismaProfile
    }
  }

  return {
    authApi: authApi,
    session: session,
    user: user,
    profile: profile,
    db: prisma,
  }
}
/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ ctx, shape, error }) => {
    if (ctx?.user?.email) {
      void posthogNodeCapture({
        distinctId: ctx.user.id,
        event: POSTHOG_EVENTS["trpc error"],
        properties: {
          error: error,
          shape: shape,
        },
      })
    }

    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * Middleware for timing procedure execution
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const userProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" })
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
      profile: ctx.profile,
    },
  })
})

/**
 * Protected (authenticated) procedure with profile requirement
 *
 * If you want a query or mutation to ONLY be accessible to logged in users who have completed
 * their profile setup, use this. It verifies the session is valid, guarantees `ctx.session.user`
 * is not null, and ensures `ctx.session.profile` exists.
 *
 * @see https://trpc.io/docs/procedures
 */
export const profileProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" })
  }

  if (!ctx.profile) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Profile not found" })
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.user,
      profile: ctx.profile,
    },
  })
})

/**
 * Protected (authenticated) procedure with organization membership requirement
 *
 * If you want a query or mutation to ONLY be accessible to logged in users who are members
 * of a specific organization, use this. It verifies the session is valid, guarantees
 * `ctx.session.user` is not null, ensures `ctx.session.profile` exists, and validates
 * organization membership.
 *
 * @see https://trpc.io/docs/procedures
 */
export const organizationProcedure = t.procedure
  .input(z.object({ organizationId: z.string() }))
  .use(timingMiddleware)
  .use(async ({ ctx, next, input }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" })
    }

    if (!ctx.profile) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Profile not found" })
    }

    // First check if user is a member, then fetch organization
    const member = await ctx.db.member.findFirst({
      where: {
        profileId: ctx.profile.id,
        organizationId: input.organizationId,
      },
      select: {
        organization: { select: organizationSelect },
      },
    })

    if (!member) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this organization",
      })
    }

    return next({
      ctx: {
        session: ctx.session,
        user: ctx.user,
        profile: ctx.profile,
        organization: member.organization,
      },
    })
  })

/**
 * Protected (authenticated) procedure with organization membership and unlimited plan requirement
 *
 * If you want a query or mutation to ONLY be accessible to logged in users who are members
 * of a specific organization AND have an unlimited plan, use this. It extends organizationProcedure
 * with an additional check for unlimited access via RevenueCat entitlements.
 *
 * @see https://trpc.io/docs/procedures
 */
export const organizationUnlimitedProcedure = organizationProcedure.use(({ ctx, next }) => {
  if (!isUnlimited(ctx.organization)) {
    throw new TRPCError({ code: "PAYMENT_REQUIRED", message: "You need to upgrade your plan to have access to this feature." })
  }

  return next({
    ctx,
  })
})

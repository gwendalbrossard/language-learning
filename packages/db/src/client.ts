import { PrismaClient } from "../generated"
import { env } from "./env"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

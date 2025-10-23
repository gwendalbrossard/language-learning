import http from "http"
import express from "express"
import { Server } from "socket.io"

import { prisma } from "@acme/db"
import { ZPracticeSchema } from "@acme/validators"

import { auth } from "./auth"
import { handleLessonSession } from "./lesson"
import { handleRoleplaySession } from "./roleplay"
import { isUnlimited } from "./utils/revenuecat"

// Express setup
const app = express()
const server = http.createServer(app)
const io = new Server(server)

// Socket.io setup
io.on("connection", async (socket) => {
  const bearerToken = socket.handshake.headers.authorization

  if (!bearerToken) {
    console.error("No bearer token found")
    socket.disconnect()
    return
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: bearerToken }),
  })

  if (!session) {
    socket.disconnect()
    return
  }

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })

  if (!profile) {
    console.error("Could not find profile")
    socket.disconnect()
    return
  }

  // Either roleplay or lesson
  const practice = socket.handshake.query.practice
  if (!practice) {
    console.error("Could not find practice query")
    socket.disconnect()
    return
  }

  if (typeof practice !== "string") {
    console.error("Practice is of wrong type")
    socket.disconnect()
    return
  }

  const parsedPractice = ZPracticeSchema.safeParse(JSON.parse(practice))

  if (!parsedPractice.success) {
    console.error("Could not parse practice data")
    socket.disconnect()
    return
  }

  // First check if user is a member, then fetch organization
  const member = await prisma.member.findFirst({
    where: {
      profileId: profile.id,
      organizationId: parsedPractice.data.organizationId,
    },
    select: { organization: true },
  })

  if (!member) {
    console.error("User not a member of this organization")
    socket.disconnect()
    return
  }

  const organization = member.organization

  if (!isUnlimited(organization)) {
    socket.disconnect()
    return
  }

  if ("roleplaySessionId" in parsedPractice.data) {
    console.log("Roleplay session ID", parsedPractice.data.roleplaySessionId)
    await handleRoleplaySession({
      roleplaySessionId: parsedPractice.data.roleplaySessionId,
      profile: profile,
      organization: organization,
      socket: socket,
    })
  }

  if ("lessonSessionId" in parsedPractice.data) {
    console.log("Lesson session ID", parsedPractice.data.lessonSessionId)
    await handleLessonSession({
      lessonSessionId: parsedPractice.data.lessonSessionId,
      profile: profile,
      organization: organization,
      socket: socket,
    })
  }
})

// Start server

const PORT = 3002
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

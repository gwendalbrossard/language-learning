-- CreateEnum
CREATE TYPE "public"."openai_role" AS ENUM ('ASSISTANT', 'USER', 'SYSTEM');

-- CreateTable
CREATE TABLE "public"."roleplay_scenario" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roleplay_scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roleplay_session" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roleplay_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roleplay_session_message" (
    "id" TEXT NOT NULL,
    "role" "public"."openai_role" NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "feedback" JSONB,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roleplay_session_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roleplay_scenario_slug_key" ON "public"."roleplay_scenario"("slug");

-- CreateIndex
CREATE INDEX "roleplay_session_profileId_idx" ON "public"."roleplay_session"("profileId");

-- CreateIndex
CREATE INDEX "roleplay_session_profileId_scenarioId_idx" ON "public"."roleplay_session"("profileId", "scenarioId");

-- CreateIndex
CREATE INDEX "roleplay_session_message_sessionId_idx" ON "public"."roleplay_session_message"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."roleplay_session" ADD CONSTRAINT "roleplay_session_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "public"."roleplay_scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay_session" ADD CONSTRAINT "roleplay_session_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay_session_message" ADD CONSTRAINT "roleplay_session_message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."roleplay_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

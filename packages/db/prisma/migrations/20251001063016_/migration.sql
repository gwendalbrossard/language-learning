-- CreateEnum
CREATE TYPE "public"."lesson_session_message_role" AS ENUM ('ASSISTANT', 'USER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."LessonVocabularyType" AS ENUM ('WORD', 'PHRASE', 'EXPRESSION');

-- CreateTable
CREATE TABLE "public"."lesson" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "profileId" TEXT,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_session" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "userSpeakingDuration" INTEGER NOT NULL DEFAULT 0,
    "aiSpeakingDuration" INTEGER NOT NULL DEFAULT 0,
    "lessonId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_session_message" (
    "id" TEXT NOT NULL,
    "role" "public"."lesson_session_message_role" NOT NULL,
    "content" TEXT NOT NULL,
    "feedback" JSONB,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_session_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_category" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "parentCategoryId" TEXT,
    "profileId" TEXT,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lesson_vocabulary" (
    "id" TEXT NOT NULL,
    "type" "public"."LessonVocabularyType" NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "information" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_session_profileId_idx" ON "public"."lesson_session"("profileId");

-- CreateIndex
CREATE INDEX "lesson_session_organizationId_idx" ON "public"."lesson_session"("organizationId");

-- CreateIndex
CREATE INDEX "lesson_session_message_sessionId_idx" ON "public"."lesson_session_message"("sessionId");

-- CreateIndex
CREATE INDEX "lesson_vocabulary_sessionId_idx" ON "public"."lesson_vocabulary"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."lesson" ADD CONSTRAINT "lesson_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."lesson_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson" ADD CONSTRAINT "lesson_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson" ADD CONSTRAINT "lesson_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_session" ADD CONSTRAINT "lesson_session_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_session" ADD CONSTRAINT "lesson_session_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_session" ADD CONSTRAINT "lesson_session_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_session_message" ADD CONSTRAINT "lesson_session_message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."lesson_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_category" ADD CONSTRAINT "lesson_category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."lesson_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_category" ADD CONSTRAINT "lesson_category_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_category" ADD CONSTRAINT "lesson_category_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lesson_vocabulary" ADD CONSTRAINT "lesson_vocabulary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."lesson_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

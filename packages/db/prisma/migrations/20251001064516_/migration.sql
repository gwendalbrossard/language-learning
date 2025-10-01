/*
  Warnings:

  - You are about to drop the `lesson_vocabulary` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."LessonSessionVocabularyType" AS ENUM ('WORD', 'PHRASE', 'EXPRESSION');

-- DropForeignKey
ALTER TABLE "public"."lesson_vocabulary" DROP CONSTRAINT "lesson_vocabulary_sessionId_fkey";

-- DropTable
DROP TABLE "public"."lesson_vocabulary";

-- DropEnum
DROP TYPE "public"."LessonVocabularyType";

-- CreateTable
CREATE TABLE "public"."lesson_session_vocabulary" (
    "id" TEXT NOT NULL,
    "type" "public"."LessonSessionVocabularyType" NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "information" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_session_vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_session_vocabulary_sessionId_idx" ON "public"."lesson_session_vocabulary"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."lesson_session_vocabulary" ADD CONSTRAINT "lesson_session_vocabulary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."lesson_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

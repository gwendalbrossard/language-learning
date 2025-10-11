/*
  Warnings:

  - You are about to drop the column `feedback` on the `lesson_session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."lesson_session" DROP COLUMN "feedback";

-- AlterTable
ALTER TABLE "public"."profile" ADD COLUMN     "tokensPronunciationInput" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensPronunciationOutput" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensTranslationInput" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensTranslationOutput" INTEGER NOT NULL DEFAULT 0;

/*
  Warnings:

  - You are about to drop the column `information` on the `lesson_session_vocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."lesson_session_vocabulary" DROP COLUMN "information",
ADD COLUMN     "romanization" TEXT;

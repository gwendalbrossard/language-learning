/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `vocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."vocabulary" DROP COLUMN "audioUrl",
ADD COLUMN     "audioStorageKey" TEXT;

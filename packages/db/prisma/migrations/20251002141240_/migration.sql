/*
  Warnings:

  - You are about to drop the column `scenarioId` on the `roleplay_session` table. All the data in the column will be lost.
  - You are about to drop the `roleplay_scenario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleplayId` to the `roleplay_session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."roleplay_scenario" DROP CONSTRAINT "roleplay_scenario_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."roleplay_scenario" DROP CONSTRAINT "roleplay_scenario_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."roleplay_scenario" DROP CONSTRAINT "roleplay_scenario_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."roleplay_session" DROP CONSTRAINT "roleplay_session_scenarioId_fkey";

-- AlterTable
ALTER TABLE "public"."roleplay_session" DROP COLUMN "scenarioId",
ADD COLUMN     "roleplayId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."roleplay_scenario";

-- CreateTable
CREATE TABLE "public"."roleplay" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "assistantRole" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "profileId" TEXT,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roleplay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."roleplay" ADD CONSTRAINT "roleplay_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."roleplay_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay" ADD CONSTRAINT "roleplay_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay" ADD CONSTRAINT "roleplay_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay_session" ADD CONSTRAINT "roleplay_session_roleplayId_fkey" FOREIGN KEY ("roleplayId") REFERENCES "public"."roleplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

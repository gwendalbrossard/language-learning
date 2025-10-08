/*
  Warnings:

  - A unique constraint covering the columns `[profileId,date,organizationId]` on the table `streak_day` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `streak_day` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."streak_day_profileId_date_idx";

-- DropIndex
DROP INDEX "public"."streak_day_profileId_date_key";

-- AlterTable
ALTER TABLE "public"."streak_day" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "streak_day_profileId_date_organizationId_idx" ON "public"."streak_day"("profileId", "date", "organizationId");

-- CreateIndex
CREATE INDEX "streak_day_organizationId_idx" ON "public"."streak_day"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "streak_day_profileId_date_organizationId_key" ON "public"."streak_day"("profileId", "date", "organizationId");

-- AddForeignKey
ALTER TABLE "public"."streak_day" ADD CONSTRAINT "streak_day_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

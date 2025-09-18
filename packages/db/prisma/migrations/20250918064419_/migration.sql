/*
  Warnings:

  - Added the required column `organizationId` to the `roleplay_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."roleplay_session" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "roleplay_session_organizationId_idx" ON "public"."roleplay_session"("organizationId");

-- AddForeignKey
ALTER TABLE "public"."roleplay_session" ADD CONSTRAINT "roleplay_session_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `isPublic` to the `roleplay_category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."roleplay_category" ADD COLUMN     "isPublic" BOOLEAN NOT NULL,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "profileId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."roleplay_category" ADD CONSTRAINT "roleplay_category_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay_category" ADD CONSTRAINT "roleplay_category_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `category` on the `roleplay_scenario` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `roleplay_scenario` table. All the data in the column will be lost.
  - Added the required column `assistantRole` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userRole` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `roleplay_scenario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."RoleplayDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropIndex
DROP INDEX "public"."roleplay_session_profileId_scenarioId_idx";

-- AlterTable
ALTER TABLE "public"."roleplay_scenario" DROP COLUMN "category",
DROP COLUMN "instructions",
ADD COLUMN     "assistantRole" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userRole" TEXT NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "public"."RoleplayDifficulty" NOT NULL;

-- CreateTable
CREATE TABLE "public"."roleplay_category" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentCategoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roleplay_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."roleplay_scenario" ADD CONSTRAINT "roleplay_scenario_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."roleplay_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roleplay_category" ADD CONSTRAINT "roleplay_category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "public"."roleplay_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `slug` on the `roleplay_scenario` table. All the data in the column will be lost.
  - Added the required column `emoji` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructions` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."roleplay_scenario_slug_key";

-- AlterTable
ALTER TABLE "public"."roleplay_scenario" DROP COLUMN "slug",
ADD COLUMN     "emoji" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT NOT NULL;

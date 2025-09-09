/*
  Warnings:

  - You are about to drop the column `tags` on the `roleplay_scenario` table. All the data in the column will be lost.
  - Added the required column `category` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."roleplay_scenario" DROP COLUMN "tags",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "difficulty" INTEGER NOT NULL;

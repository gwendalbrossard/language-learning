/*
  Warnings:

  - Changed the type of `difficulty` on the `roleplay_scenario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."roleplay_scenario" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."RoleplayDifficulty";

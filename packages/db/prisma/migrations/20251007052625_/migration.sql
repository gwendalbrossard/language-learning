/*
  Warnings:

  - You are about to drop the column `minutesSpoken` on the `profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."profile" DROP COLUMN "minutesSpoken",
ADD COLUMN     "secondsInLessons" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "secondsInRoleplays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "secondsSpoken" INTEGER NOT NULL DEFAULT 0;

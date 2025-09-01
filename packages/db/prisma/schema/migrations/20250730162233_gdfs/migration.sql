/*
  Warnings:

  - Added the required column `metadata` to the `organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."organization" DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB NOT NULL;

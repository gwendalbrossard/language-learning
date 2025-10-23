/*
  Warnings:

  - Added the required column `phraseExample` to the `vocabulary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phraseExampleTranslation` to the `vocabulary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."vocabulary" ADD COLUMN     "phraseExample" TEXT NOT NULL,
ADD COLUMN     "phraseExampleTranslation" TEXT NOT NULL;

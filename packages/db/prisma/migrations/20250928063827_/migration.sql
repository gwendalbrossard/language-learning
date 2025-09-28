/*
  Warnings:

  - Added the required column `prompt` to the `roleplay_scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."roleplay_scenario" ADD COLUMN     "prompt" TEXT NOT NULL;

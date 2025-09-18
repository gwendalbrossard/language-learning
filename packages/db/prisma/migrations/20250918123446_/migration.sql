-- CreateEnum
CREATE TYPE "public"."LearningLanguageLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFICIENT', 'FLUENT');

-- AlterTable
ALTER TABLE "public"."profile" ADD COLUMN     "learningLanguage" TEXT NOT NULL DEFAULT 'EN',
ADD COLUMN     "learningLanguageLevel" "public"."LearningLanguageLevel" NOT NULL DEFAULT 'INTERMEDIATE',
ADD COLUMN     "nativeLanguage" TEXT NOT NULL DEFAULT 'FR';

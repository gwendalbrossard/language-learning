-- CreateEnum
CREATE TYPE "public"."VocabularyType" AS ENUM ('WORD', 'PHRASE', 'EXPRESSION');

-- CreateTable
CREATE TABLE "public"."vocabulary" (
    "id" TEXT NOT NULL,
    "type" "public"."VocabularyType" NOT NULL,
    "text" TEXT NOT NULL,
    "romanization" TEXT,
    "translation" TEXT NOT NULL,
    "learningLanguage" TEXT NOT NULL,
    "masteredAt" TIMESTAMP(3),
    "profileId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vocabulary_profileId_idx" ON "public"."vocabulary"("profileId");

-- CreateIndex
CREATE INDEX "vocabulary_organizationId_idx" ON "public"."vocabulary"("organizationId");

-- CreateIndex
CREATE INDEX "vocabulary_profileId_organizationId_idx" ON "public"."vocabulary"("profileId", "organizationId");

-- AddForeignKey
ALTER TABLE "public"."vocabulary" ADD CONSTRAINT "vocabulary_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vocabulary" ADD CONSTRAINT "vocabulary_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

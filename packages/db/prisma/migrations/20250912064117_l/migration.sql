-- AlterTable
ALTER TABLE "public"."roleplay_session" ADD COLUMN     "aiSpeakingDuration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userSpeakingDuration" INTEGER NOT NULL DEFAULT 0;

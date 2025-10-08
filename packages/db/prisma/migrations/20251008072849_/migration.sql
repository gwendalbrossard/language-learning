-- AlterTable
ALTER TABLE "public"."profile" ADD COLUMN     "lastStreakDayId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_lastStreakDayId_fkey" FOREIGN KEY ("lastStreakDayId") REFERENCES "public"."streak_day"("id") ON DELETE SET NULL ON UPDATE CASCADE;

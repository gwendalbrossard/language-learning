-- AlterTable
ALTER TABLE "public"."roleplay_scenario" ADD COLUMN     "profileId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."roleplay_scenario" ADD CONSTRAINT "roleplay_scenario_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."roleplay_scenario" ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."roleplay_scenario" ADD CONSTRAINT "roleplay_scenario_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

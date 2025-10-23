-- CreateIndex
CREATE INDEX "lesson_session_profileId_organizationId_idx" ON "public"."lesson_session"("profileId", "organizationId");

-- CreateIndex
CREATE INDEX "roleplay_session_profileId_organizationId_idx" ON "public"."roleplay_session"("profileId", "organizationId");

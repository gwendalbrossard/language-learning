-- DropForeignKey
ALTER TABLE "public"."roleplay_session_message" DROP CONSTRAINT "roleplay_session_message_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."roleplay_session_message" ADD CONSTRAINT "roleplay_session_message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."roleplay_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

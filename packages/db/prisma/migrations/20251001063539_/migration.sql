/*
  Warnings:

  - Changed the type of `role` on the `roleplay_session_message` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."roleplay_session_message_role" AS ENUM ('ASSISTANT', 'USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "public"."roleplay_session_message" DROP COLUMN "role",
ADD COLUMN     "role" "public"."roleplay_session_message_role" NOT NULL;

-- DropEnum
DROP TYPE "public"."openai_role";

-- AlterTable
ALTER TABLE "public"."lesson_session" ADD COLUMN     "tokensInputAudio" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputAudioCached" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputText" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputTextCached" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensOutputAudio" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensOutputText" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."profile" ADD COLUMN     "tokensInputAudio" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputAudioCached" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputText" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputTextCached" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensOutputAudio" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensOutputText" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."roleplay_session" ADD COLUMN     "tokensInputAudio" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputAudioCached" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputText" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensInputTextCached" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensOutputAudio" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tokensOutputText" INTEGER NOT NULL DEFAULT 0;

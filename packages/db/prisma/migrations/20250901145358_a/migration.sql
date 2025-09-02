-- CreateTable
CREATE TABLE "public"."streak_day" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streak_day_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "streak_day_profileId_date_idx" ON "public"."streak_day"("profileId", "date");

-- CreateIndex
CREATE INDEX "streak_day_profileId_idx" ON "public"."streak_day"("profileId");

-- CreateIndex
CREATE INDEX "streak_day_date_idx" ON "public"."streak_day"("date");

-- CreateIndex
CREATE UNIQUE INDEX "streak_day_profileId_date_key" ON "public"."streak_day"("profileId", "date");

-- AddForeignKey
ALTER TABLE "public"."streak_day" ADD CONSTRAINT "streak_day_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

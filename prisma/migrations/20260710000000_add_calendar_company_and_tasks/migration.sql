CREATE TYPE "CalendarItemType" AS ENUM ('EVENT', 'TASK');

ALTER TABLE "CalendarEvent"
ADD COLUMN "companyId" TEXT,
ADD COLUMN "type" "CalendarItemType" NOT NULL DEFAULT 'EVENT',
ADD COLUMN "completed" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "CalendarEvent_companyId_idx" ON "CalendarEvent"("companyId");
CREATE INDEX "CalendarEvent_type_idx" ON "CalendarEvent"("type");

ALTER TABLE "CalendarEvent"
ADD CONSTRAINT "CalendarEvent_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

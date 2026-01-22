/*
  Warnings:

  - Added the required column `updatedAt` to the `WorkingHour` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CalendarRuleType" AS ENUM ('DAY_OFF', 'CUSTOM_DAY', 'RANGE_OFF', 'RANGE_CUSTOM');

-- AlterTable
ALTER TABLE "WorkingHour" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CalendarRule" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "type" "CalendarRuleType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarRule_serviceId_idx" ON "CalendarRule"("serviceId");

-- CreateIndex
CREATE INDEX "CalendarRule_type_idx" ON "CalendarRule"("type");

-- CreateIndex
CREATE INDEX "CalendarRule_startDate_idx" ON "CalendarRule"("startDate");

-- CreateIndex
CREATE INDEX "CalendarRule_endDate_idx" ON "CalendarRule"("endDate");

-- AddForeignKey
ALTER TABLE "CalendarRule" ADD CONSTRAINT "CalendarRule_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

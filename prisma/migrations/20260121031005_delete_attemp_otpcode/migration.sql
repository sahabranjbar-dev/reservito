/*
  Warnings:

  - You are about to drop the column `attempts` on the `OtpCode` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `OtpCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OtpCode" DROP COLUMN "attempts",
DROP COLUMN "lockedUntil";

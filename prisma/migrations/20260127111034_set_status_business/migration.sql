/*
  Warnings:

  - You are about to drop the column `identifier` on the `Business` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BusinessRegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "Business_identifier_key";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "identifier",
ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "registrationStatus" "BusinessRegistrationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ALTER COLUMN "isActive" SET DEFAULT false;

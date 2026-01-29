-- CreateEnum
CREATE TYPE "DiscountUsageStatus" AS ENUM ('RESERVED', 'CONFIRMED', 'CANCELED');

-- AlterTable
ALTER TABLE "DiscountUsage" ADD COLUMN     "disCountUsageStatus" "DiscountUsageStatus" NOT NULL DEFAULT 'RESERVED';

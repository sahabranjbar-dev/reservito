-- CreateEnum
CREATE TYPE "StaffServiceChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "Booking_businessId_startTime_idx";

-- DropIndex
DROP INDEX "Booking_customerId_idx";

-- DropIndex
DROP INDEX "Booking_staffId_idx";

-- DropIndex
DROP INDEX "BusinessMember_businessId_idx";

-- DropIndex
DROP INDEX "BusinessMember_userId_idx";

-- DropIndex
DROP INDEX "LedgerEntry_businessId_idx";

-- DropIndex
DROP INDEX "LedgerEntry_walletType_idx";

-- DropIndex
DROP INDEX "OtpCode_expiresAt_idx";

-- DropIndex
DROP INDEX "Payment_businessId_idx";

-- DropIndex
DROP INDEX "Service_businessId_idx";

-- DropIndex
DROP INDEX "Settlement_businessId_status_idx";

-- DropIndex
DROP INDEX "StaffException_staffId_date_idx";

-- DropIndex
DROP INDEX "StaffMember_businessId_idx";

-- DropIndex
DROP INDEX "StaffMember_userId_idx";

-- CreateTable
CREATE TABLE "StaffServiceChangeRequest" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "requestedPrice" INTEGER,
    "requestedActive" BOOLEAN,
    "status" "StaffServiceChangeStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "StaffServiceChangeRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffServiceChangeRequest" ADD CONSTRAINT "StaffServiceChangeRequest_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffServiceChangeRequest" ADD CONSTRAINT "StaffServiceChangeRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "ContactMessage" ALTER COLUMN "status" SET DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "StaffMember" ADD COLUMN     "breakMinutes" INTEGER NOT NULL DEFAULT 0;

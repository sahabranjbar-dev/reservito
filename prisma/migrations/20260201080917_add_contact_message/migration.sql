/*
  Warnings:

  - You are about to drop the column `isValidPhone` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'REPLIED', 'CLOSED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isValidPhone";

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

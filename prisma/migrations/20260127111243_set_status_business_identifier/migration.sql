/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_identifier_key" ON "Business"("identifier");

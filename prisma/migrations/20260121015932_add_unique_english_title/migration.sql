/*
  Warnings:

  - A unique constraint covering the columns `[englishTitle]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Made the column `englishTitle` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "englishTitle" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_englishTitle_key" ON "Role"("englishTitle");

/*
  Warnings:

  - Added the required column `updatedAt` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

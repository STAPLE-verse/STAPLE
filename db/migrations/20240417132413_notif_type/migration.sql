/*
  Warnings:

  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "templateType" AS ENUM ('email', 'notification');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "templateType" NOT NULL;

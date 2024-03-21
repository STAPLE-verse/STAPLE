-- CreateEnum
CREATE TYPE "CompletedAs" AS ENUM ('INDIVIDUAL', 'TEAM');

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "completedAs" "CompletedAs" NOT NULL DEFAULT 'INDIVIDUAL';

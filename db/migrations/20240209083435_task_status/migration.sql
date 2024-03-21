-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('COMPLETED', 'NOT_COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'NOT_COMPLETED';

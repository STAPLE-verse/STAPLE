/*
  Warnings:

  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'NOT_COMPLETED');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NOT_COMPLETED';

-- DropEnum
DROP TYPE "TaskStatus";

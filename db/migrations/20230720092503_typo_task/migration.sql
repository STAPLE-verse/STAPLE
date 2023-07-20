/*
  Warnings:

  - You are about to drop the column `Description` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;

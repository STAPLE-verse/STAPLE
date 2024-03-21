/*
  Warnings:

  - Added the required column `createdById` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

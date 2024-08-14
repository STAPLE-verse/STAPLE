/*
  Warnings:

  - You are about to drop the column `schema` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `ui` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "schema",
DROP COLUMN "ui",
ADD COLUMN     "formVersionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_formVersionId_fkey" FOREIGN KEY ("formVersionId") REFERENCES "FormVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

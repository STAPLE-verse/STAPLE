/*
  Warnings:

  - You are about to drop the column `projectId` on the `Label` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_projectId_fkey";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "projectId";

-- CreateTable
CREATE TABLE "_LabelToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LabelToProject_AB_unique" ON "_LabelToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_LabelToProject_B_index" ON "_LabelToProject"("B");

-- AddForeignKey
ALTER TABLE "_LabelToProject" ADD CONSTRAINT "_LabelToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabelToProject" ADD CONSTRAINT "_LabelToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

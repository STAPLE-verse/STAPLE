/*
  Warnings:

  - You are about to drop the column `columnId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `columnTaskIndex` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `containerId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_columnId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "columnId",
DROP COLUMN "columnTaskIndex",
ADD COLUMN     "containerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Column";

-- CreateTable
CREATE TABLE "KanbanBoard" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'To Do',
    "containerOrder" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "KanbanBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "KanbanBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KanbanBoard" ADD CONSTRAINT "KanbanBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `projectId` on the `ContributorLabel` table. All the data in the column will be lost.
  - You are about to drop the column `labels` on the `Task` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ContributorLabel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContributorLabel" DROP COLUMN "projectId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "labels",
ADD COLUMN     "tags" TEXT;

-- AddForeignKey
ALTER TABLE "ContributorLabel" ADD CONSTRAINT "ContributorLabel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

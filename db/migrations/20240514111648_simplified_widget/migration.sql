/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Widget` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Widget` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Widget` table. All the data in the column will be lost.
  - You are about to drop the `UserWidgets` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,type]` on the table `Widget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Widget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserWidgets" DROP CONSTRAINT "UserWidgets_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserWidgets" DROP CONSTRAINT "UserWidgets_widgetId_fkey";

-- DropIndex
DROP INDEX "Widget_position_key";

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "createdAt",
DROP COLUMN "title",
DROP COLUMN "updatedAt",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserWidgets";

-- CreateIndex
CREATE UNIQUE INDEX "Widget_userId_type_key" ON "Widget"("userId", "type");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

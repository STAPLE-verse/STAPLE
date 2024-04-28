/*
  Warnings:

  - You are about to drop the `ContributorLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContributorLabel" DROP CONSTRAINT "ContributorLabel_userId_fkey";

-- DropTable
DROP TABLE "ContributorLabel";

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

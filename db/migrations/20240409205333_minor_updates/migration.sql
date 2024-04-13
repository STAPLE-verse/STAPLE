/*
  Warnings:

  - You are about to drop the column `role` on the `Contributor` table. All the data in the column will be lost.
  - Added the required column `citation` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keywords` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContributorPrivileges" AS ENUM ('PROJECT_MANAGER', 'CONTRIBUTOR');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('INVITED', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invitationStatus" "InvitationStatus" NOT NULL DEFAULT 'INVITED',
ADD COLUMN     "privilege" "ContributorPrivileges" NOT NULL DEFAULT 'PROJECT_MANAGER';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "citation" TEXT NOT NULL,
ADD COLUMN     "identifier" TEXT,
ADD COLUMN     "keywords" TEXT NOT NULL,
ADD COLUMN     "publisher" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "labels" TEXT;

-- DropEnum
DROP TYPE "ContributorRole";

-- CreateTable
CREATE TABLE "ContributorLabel" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT,

    CONSTRAINT "ContributorLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forms" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "json" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Forms_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Forms" ADD CONSTRAINT "Forms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

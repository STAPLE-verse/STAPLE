/*
  Warnings:

  - The `privilege` column on the `Contributor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `privilege` column on the `Invitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `privilege` column on the `ProjectWidget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_LabelToProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberPrivileges" AS ENUM ('PROJECT_MANAGER', 'CONTRIBUTOR');

-- DropForeignKey
ALTER TABLE "_LabelToProject" DROP CONSTRAINT "_LabelToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToProject" DROP CONSTRAINT "_LabelToProject_B_fkey";

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "privilege",
ADD COLUMN     "privilege" "MemberPrivileges" NOT NULL DEFAULT 'PROJECT_MANAGER';

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "privilege",
ADD COLUMN     "privilege" "MemberPrivileges" NOT NULL DEFAULT 'CONTRIBUTOR';

-- AlterTable
ALTER TABLE "ProjectWidget" DROP COLUMN "privilege",
ADD COLUMN     "privilege" "MemberPrivileges"[] DEFAULT ARRAY['CONTRIBUTOR', 'PROJECT_MANAGER']::"MemberPrivileges"[];

-- DropTable
DROP TABLE "_LabelToProject";

-- DropEnum
DROP TYPE "ContributorPrivileges";

-- CreateEnum
CREATE TYPE "ContributorRole" AS ENUM ('PROJECT_MANAGER', 'CONTRIBUTOR');

-- AlterTable
ALTER TABLE "Contributor" ADD COLUMN     "role" "ContributorRole" NOT NULL DEFAULT 'CONTRIBUTOR';

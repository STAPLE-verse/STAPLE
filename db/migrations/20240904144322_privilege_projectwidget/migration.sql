-- AlterTable
ALTER TABLE "ProjectWidget" ADD COLUMN     "privilege" "ContributorPrivileges"[] DEFAULT ARRAY['CONTRIBUTOR', 'PROJECT_MANAGER']::"ContributorPrivileges"[];

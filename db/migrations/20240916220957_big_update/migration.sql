/*
  Warnings:

  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssignmentStatusLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContributorToLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContributorToTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InvitationToLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LabelToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_teamId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentStatusLog" DROP CONSTRAINT "AssignmentStatusLog_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentStatusLog" DROP CONSTRAINT "AssignmentStatusLog_completedBy_fkey";

-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_ContributorToLabel" DROP CONSTRAINT "_ContributorToLabel_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContributorToLabel" DROP CONSTRAINT "_ContributorToLabel_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContributorToTeam" DROP CONSTRAINT "_ContributorToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContributorToTeam" DROP CONSTRAINT "_ContributorToTeam_B_fkey";

-- DropForeignKey
ALTER TABLE "_InvitationToLabel" DROP CONSTRAINT "_InvitationToLabel_A_fkey";

-- DropForeignKey
ALTER TABLE "_InvitationToLabel" DROP CONSTRAINT "_InvitationToLabel_B_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToTask" DROP CONSTRAINT "_LabelToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToTask" DROP CONSTRAINT "_LabelToTask_B_fkey";

-- DropTable
DROP TABLE "Assignment";

-- DropTable
DROP TABLE "AssignmentStatusLog";

-- DropTable
DROP TABLE "Contributor";

-- DropTable
DROP TABLE "Label";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_ContributorToLabel";

-- DropTable
DROP TABLE "_ContributorToTeam";

-- DropTable
DROP TABLE "_InvitationToLabel";

-- DropTable
DROP TABLE "_LabelToTask";

-- DropEnum
DROP TYPE "AssignmentStatus";

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPrivilege" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "privilege" "MemberPrivileges" NOT NULL DEFAULT 'PROJECT_MANAGER',

    CONSTRAINT "ProjectPrivilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "taxonomy" TEXT,
    "projectId" INTEGER,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'NOT_COMPLETED',
    "metadata" JSONB,
    "completedAs" "CompletedAs" NOT NULL DEFAULT 'INDIVIDUAL',
    "assignedToId" INTEGER NOT NULL,
    "completedById" INTEGER,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "TaskLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectMemberToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectMemberToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_InvitationToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectMemberToUser_AB_unique" ON "_ProjectMemberToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectMemberToUser_B_index" ON "_ProjectMemberToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectMemberToRole_AB_unique" ON "_ProjectMemberToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectMemberToRole_B_index" ON "_ProjectMemberToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InvitationToRole_AB_unique" ON "_InvitationToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_InvitationToRole_B_index" ON "_InvitationToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToTask_AB_unique" ON "_RoleToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToTask_B_index" ON "_RoleToTask"("B");

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPrivilege" ADD CONSTRAINT "ProjectPrivilege_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPrivilege" ADD CONSTRAINT "ProjectPrivilege_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "ProjectMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "ProjectMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "ProjectMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLog" ADD CONSTRAINT "TaskLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMemberToUser" ADD CONSTRAINT "_ProjectMemberToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMemberToUser" ADD CONSTRAINT "_ProjectMemberToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMemberToRole" ADD CONSTRAINT "_ProjectMemberToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMemberToRole" ADD CONSTRAINT "_ProjectMemberToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitationToRole" ADD CONSTRAINT "_InvitationToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitationToRole" ADD CONSTRAINT "_InvitationToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToTask" ADD CONSTRAINT "_RoleToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToTask" ADD CONSTRAINT "_RoleToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

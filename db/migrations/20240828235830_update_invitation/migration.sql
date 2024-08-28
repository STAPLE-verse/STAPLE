-- CreateTable
CREATE TABLE "Invitation" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "email" TEXT,
    "privilege" "ContributorPrivileges" NOT NULL DEFAULT 'CONTRIBUTOR',
    "addedBy" TEXT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InvitationToLabel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InvitationToLabel_AB_unique" ON "_InvitationToLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_InvitationToLabel_B_index" ON "_InvitationToLabel"("B");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitationToLabel" ADD CONSTRAINT "_InvitationToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitationToLabel" ADD CONSTRAINT "_InvitationToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "_ContributorToLabel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContributorToLabel_AB_unique" ON "_ContributorToLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_ContributorToLabel_B_index" ON "_ContributorToLabel"("B");

-- AddForeignKey
ALTER TABLE "_ContributorToLabel" ADD CONSTRAINT "_ContributorToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "Contributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContributorToLabel" ADD CONSTRAINT "_ContributorToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

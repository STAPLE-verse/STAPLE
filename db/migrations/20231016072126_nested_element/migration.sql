-- CreateTable
CREATE TABLE "_ElementToElement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ElementToElement_AB_unique" ON "_ElementToElement"("A", "B");

-- CreateIndex
CREATE INDEX "_ElementToElement_B_index" ON "_ElementToElement"("B");

-- AddForeignKey
ALTER TABLE "_ElementToElement" ADD CONSTRAINT "_ElementToElement_A_fkey" FOREIGN KEY ("A") REFERENCES "Element"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementToElement" ADD CONSTRAINT "_ElementToElement_B_fkey" FOREIGN KEY ("B") REFERENCES "Element"("id") ON DELETE CASCADE ON UPDATE CASCADE;

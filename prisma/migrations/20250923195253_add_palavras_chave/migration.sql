-- CreateTable
CREATE TABLE "PalavraChave" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "palavra" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PalavraChaveToTrabalho" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PalavraChaveToTrabalho_A_fkey" FOREIGN KEY ("A") REFERENCES "PalavraChave" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PalavraChaveToTrabalho_B_fkey" FOREIGN KEY ("B") REFERENCES "trabalho" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PalavraChave_palavra_key" ON "PalavraChave"("palavra");

-- CreateIndex
CREATE UNIQUE INDEX "_PalavraChaveToTrabalho_AB_unique" ON "_PalavraChaveToTrabalho"("A", "B");

-- CreateIndex
CREATE INDEX "_PalavraChaveToTrabalho_B_index" ON "_PalavraChaveToTrabalho"("B");

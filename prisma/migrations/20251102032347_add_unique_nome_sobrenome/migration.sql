/*
  Warnings:

  - A unique constraint covering the columns `[nome,sobrenome]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_sobrenome_key" ON "Pessoa"("nome", "sobrenome");

/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[titulo]` on the table `Trabalho` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senha` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "senha" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trabalho" ALTER COLUMN "dataPublicacao" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_nome_key" ON "Admin"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Trabalho_titulo_key" ON "Trabalho"("titulo");

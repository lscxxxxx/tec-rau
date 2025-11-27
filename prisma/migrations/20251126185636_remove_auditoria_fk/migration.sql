/*
  Warnings:

  - You are about to drop the column `trabalho_id` on the `Auditoria` table. All the data in the column will be lost.
  - Added the required column `trabalho` to the `Auditoria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Auditoria" DROP CONSTRAINT "Auditoria_trabalho_id_fkey";

-- AlterTable
ALTER TABLE "Auditoria" DROP COLUMN "trabalho_id",
ADD COLUMN     "trabalho" INTEGER NOT NULL;

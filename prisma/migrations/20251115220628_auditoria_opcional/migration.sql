-- DropForeignKey
ALTER TABLE "Auditoria" DROP CONSTRAINT "Auditoria_trabalho_id_fkey";

-- AlterTable
ALTER TABLE "Auditoria" ALTER COLUMN "trabalho_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_trabalho_id_fkey" FOREIGN KEY ("trabalho_id") REFERENCES "Trabalho"("id") ON DELETE SET NULL ON UPDATE CASCADE;

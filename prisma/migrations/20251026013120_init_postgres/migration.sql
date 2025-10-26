-- CreateEnum
CREATE TYPE "PapelAdmin" AS ENUM ('SUPER', 'PADRAO');

-- CreateEnum
CREATE TYPE "PapelPessoa" AS ENUM ('AUTOR', 'ORIENTADOR', 'COORIENTADOR');

-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "papel" "PapelAdmin" NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "dataModificacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acao" "AcaoAuditoria" NOT NULL,
    "log" TEXT NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "trabalho_id" INTEGER NOT NULL,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDocumental" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoDocumental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trabalho" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "dataPublicacao" TIMESTAMP(3) NOT NULL,
    "dataDefesa" TIMESTAMP(3) NOT NULL,
    "resumo" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "tipodocumental_id" INTEGER NOT NULL,

    CONSTRAINT "Trabalho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PalavraChave" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "PalavraChave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrabalhoPessoa" (
    "trabalho_id" INTEGER NOT NULL,
    "pessoa_id" INTEGER NOT NULL,
    "papel" "PapelPessoa" NOT NULL,

    CONSTRAINT "TrabalhoPessoa_pkey" PRIMARY KEY ("trabalho_id","pessoa_id")
);

-- CreateTable
CREATE TABLE "TrabalhoPalavraChave" (
    "trabalho_id" INTEGER NOT NULL,
    "palavrachave_id" INTEGER NOT NULL,

    CONSTRAINT "TrabalhoPalavraChave_pkey" PRIMARY KEY ("trabalho_id","palavrachave_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nome_key" ON "Curso"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumental_nome_key" ON "TipoDocumental"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "PalavraChave_nome_key" ON "PalavraChave"("nome");

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_trabalho_id_fkey" FOREIGN KEY ("trabalho_id") REFERENCES "Trabalho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabalho" ADD CONSTRAINT "Trabalho_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trabalho" ADD CONSTRAINT "Trabalho_tipodocumental_id_fkey" FOREIGN KEY ("tipodocumental_id") REFERENCES "TipoDocumental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabalhoPessoa" ADD CONSTRAINT "TrabalhoPessoa_trabalho_id_fkey" FOREIGN KEY ("trabalho_id") REFERENCES "Trabalho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabalhoPessoa" ADD CONSTRAINT "TrabalhoPessoa_pessoa_id_fkey" FOREIGN KEY ("pessoa_id") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabalhoPalavraChave" ADD CONSTRAINT "TrabalhoPalavraChave_trabalho_id_fkey" FOREIGN KEY ("trabalho_id") REFERENCES "Trabalho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrabalhoPalavraChave" ADD CONSTRAINT "TrabalhoPalavraChave_palavrachave_id_fkey" FOREIGN KEY ("palavrachave_id") REFERENCES "PalavraChave"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

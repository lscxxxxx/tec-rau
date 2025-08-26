/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "curso" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tipotrabalho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "trabalho" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "resumo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "autor1" TEXT NOT NULL,
    "autor2" TEXT,
    "autor3" TEXT,
    "autor4" TEXT,
    "orientador" TEXT NOT NULL,
    "coorientador" TEXT,
    "refbibliografica" TEXT NOT NULL,
    "id_tipotrabalho" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,
    CONSTRAINT "trabalho_id_tipotrabalho_fkey" FOREIGN KEY ("id_tipotrabalho") REFERENCES "tipotrabalho" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trabalho_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

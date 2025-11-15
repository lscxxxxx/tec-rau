import prisma from '~/server/lib/prisma'
import { AcaoAuditoria, Prisma } from '@prisma/client'

type PrismaClient = Prisma.TransactionClient | typeof prisma
/**
 * Registra um evento de auditoria no banco de dados.
 * @param admin_id ID do admin que realizou a ação.
 * @param acao Ação realizada (CREATE, UPDATE, DELETE).
 * @param trabalho_id ID do trabalho afetado (opcional para logs de sistema).
 * @param log Uma descrição simples do que aconteceu.
 */
export async function registrarAuditoria(
    tx: PrismaClient,
    admin_id: number,
    acao: AcaoAuditoria,
    trabalho_id: number | null,
    log: string
) {
    try {
        await prisma.auditoria.create({
            data: { admin_id, acao, trabalho_id: trabalho_id ?? undefined, log, },
        })
    } catch (error) {
        // É importante que o log de auditoria NUNCA quebre a aplicação principal.
        console.error("Falha ao registrar auditoria:", error)
    }
}
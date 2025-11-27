import prisma from '~/server/lib/prisma'
import { AcaoAuditoria, Prisma } from '@prisma/client'

type PrismaClientContext = Prisma.TransactionClient | typeof prisma
/**
 * Registra um evento de auditoria no banco de dados.
 * @param admin_id ID do admin que realizou a ação.
 * @param acao Ação realizada (CREATE, UPDATE, DELETE).
 * @param trabalho ID do trabalho afetado (opcional para logs de sistema).
 * @param log Uma descrição simples do que aconteceu.
 */
export async function registrarAuditoria(
    tx: PrismaClientContext,
    admin_id: number,
    acao: AcaoAuditoria,
    trabalho: number | null,
    log: string
) {
    try {
        await tx.auditoria.create({
            data: { admin_id, acao, trabalho : trabalho ?? undefined, log, },
        })
    } catch (error) {
        // É importante que o log de auditoria NUNCA quebre a aplicação principal.
        console.error("Falha ao registrar auditoria:", error)
    }
}
import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import prisma from '~/server/lib/prisma'

const schema = z.object({
    titulo: z.string().min(1),
    data: z.string().min(1),
    resumo: z.string().min(1),
    status: z.enum(['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']),
    autor1: z.string().min(1),
    orientador: z.string().min(1),
    refbibliografica: z.string().min(1),
    tipoTrabalhoId: z.string().transform(val => Number(val)),
    cursoId: z.string().transform(val => Number(val)),
    autor2: z.string().optional(),
    autor3: z.string().optional(),
    autor4: z.string().optional(),
    coorientador: z.string().optional(),
    palavrasChave: z.string()
        .transform(val => val.split(',').map(p => p.trim()).filter(Boolean))
        .optional(),
})

export default defineEventHandler(async (event) => {
    const trabalhoId = getRouterParam(event, 'id')

    if (!trabalhoId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID do trabalho é inválido.',
        });
    }

    try {
        const formData = await readMultipartFormData(event)
        const arquivoData = formData?.find(d => d.name === 'arquivo')
        const textFields = formData?.filter(d => d.name !== 'arquivo')

        const formValues: Record<string, any> = {}
        if (textFields) {
            for (const field of textFields) {
                if (field.name)
                    formValues[field.name] = field.data.toString()
            }
        }

        const validatedData = schema.parse(formValues)
        const dadosParaPrisma: any = {
            ...validatedData,
            data: new Date(validatedData.data),
        }

        if (validatedData.palavrasChave) {
             dadosParaPrisma.palavrasChave = {
                set: [], // remove palavras antigas
                connectOrCreate: validatedData.palavrasChave.map(p => ({
                    where: { palavra: p },
                    create: { palavra: p }
                }))
            }
        }

        if (arquivoData) {
            const trabalhoAntigo = await prisma.trabalho.findUnique({
                where: {
                    id: Number(trabalhoId)
                }
            })

            const fileExtension = arquivoData.filename?.split('.').pop() || 'pdf'
            const uniqueFileName = `${nanoid()}.${fileExtension}`
            const uploadDir = resolve(process.cwd(), 'public/uploads')
            const filePath = `${uploadDir}/${uniqueFileName}`

            mkdirSync(uploadDir, { recursive: true })
            writeFileSync(filePath, arquivoData.data)

            dadosParaPrisma.arquivo = `/uploads/${uniqueFileName}`

            if (trabalhoAntigo?.arquivo) {
                const oldFilePath =  resolve(process.cwd(), `public${trabalhoAntigo.arquivo}`)
                if (existsSync(oldFilePath)) {
                    unlinkSync(oldFilePath)
                }
            }
        }

        const trabalhoAtualizado = await prisma.trabalho.update({
            where: {
                id: Number(trabalhoId),
            },
            data: dadosParaPrisma,
        })

        return trabalhoAtualizado
    } catch (error: any) {
        console.error('--- ERRO NA API DE EDIÇÃO DE TRABALHO ---', error)
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Erro de validação',
                data: error.issues
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Não foi possível atualizar o trabalho'
        })
    }
});
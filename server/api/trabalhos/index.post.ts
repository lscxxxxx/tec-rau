import { writeFileSync, mkdirSync } from 'node:fs'
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
  palavrasChave: z.string().transform(val => val.split(',')),
  autor2: z.string().optional(),
  autor3: z.string().optional(),
  autor4: z.string().optional(),
  coorientador: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    const arquivoData = formData?.find(d => d.name === 'arquivo')
    const textFields = formData?.filter(d => d.name !== 'arquivo')

    if (!arquivoData || !textFields)
      throw new Error('Arquivo ou campos de texto faltando')

    const formValues: Record<string, any> = {}
    for (const field of textFields) {
      if (field.name)
        formValues[field.name] = field.data.toString()
    }

    const validatedData = schema.parse(formValues)

    const fileExtension = arquivoData.filename?.split('.').pop() || 'pdf'
    const uniqueFileName = `${nanoid()}.${fileExtension}`
    const uploadDir = resolve(process.cwd(), 'public/uploads')
    const filePath = `${uploadDir}/${uniqueFileName}`

    mkdirSync(uploadDir, { recursive: true })
    writeFileSync(filePath, arquivoData.data)

    const dadosParaPrisma = {
      ...validatedData,
      data: new Date(validatedData.data),
      arquivo: `/uploads/${uniqueFileName}`,
      palavrasChave: {
        connectOrCreate: validatedData.palavrasChave.map((palavra: string) => ({
          where: { palavra },
          create: { palavra }
        }))
       }
    }

    const novoTrabalho = await prisma.trabalho.create({
      data: dadosParaPrisma,
    })

    setResponseStatus(event, 201)
    return novoTrabalho

  } catch (error: any) {
    console.error('--- ERRO NA API DE CADASTRO DE TRABALHO ---');

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Erro de validação`,
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Não foi possível criar o trabalho.',
    })
  }
})
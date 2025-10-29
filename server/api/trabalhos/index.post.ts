import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { PapelPessoa } from '@prisma/client'
import prisma from '~/server/lib/prisma'

const pessoaSchema = z.object({
  nome: z.string().min(1),
  sobrenome: z.string().min(1),
})

const schema = z.object({
  titulo: z.string().min(1),
  dataDefesa: z.string().min(1),
  resumo: z.string().min(1),
  tipoDocumentalId: z.string().transform(val => Number(val)),
  cursoId: z.string().transform(val => Number(val)),
  palavrasChave: z.string()
    .transform(val => val.split(',').map(p => p.trim()).filter(Boolean)).refine(arr => arr.length >= 3),
  autores: z.array(pessoaSchema).min(1),
  orientadores: z.array(pessoaSchema).min(1),
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

    const { cursoId, tipoDocumentalId, autores, orientadores, palavrasChave, ...restoDosDados } = validatedData;

    const dadosParaPrisma = {
      ...restoDosDados,
      dataDefesa: new Date(validatedData.dataDefesa),
      arquivo: `/uploads/${uniqueFileName}`,
      palavrasChave: {
        create: palavrasChave.map((palavraNome: string) => ({
          palavraChave: {
            connectOrCreate: { where: { nome: palavraNome }, create: { nome: palavraNome } }
          }
        }))
      },
      curso: { connect: { id: cursoId, },
      },
      tipoDocumental: { connect: { id: tipoDocumentalId, },
      },
      pessoas: {
        create: [
          ...autores.map(autor => ({
            papel: PapelPessoa.AUTOR,
            pessoa: { create: { nome: autor.nome, sobrenome: autor.sobrenome, }, },
          })),
          ...orientadores.map(orientador => ({
            papel: PapelPessoa.ORIENTADOR,
            pessoa: { create: { nome: orientador.nome, sobrenome: orientador.sobrenome, }, },
          })),
        ],
      },
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
        data: error.issues,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Não foi possível criar o trabalho.',
    })
  }
})
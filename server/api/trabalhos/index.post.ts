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

type PessoaInput = z.infer<typeof pessoaSchema>

function jsonString<T extends z.ZodTypeAny>(schema: T) {
  return z.string().transform((val, ctx): z.infer<T> => {
    try {
      const parsed = JSON.parse(val)
      const result = schema.safeParse(parsed)
      if (!result.success) {
        ctx.addIssue({ code: 'custom', message: 'JSON inválido' })
        return z.NEVER as any
      }
      return result.data
    } catch {
      ctx.addIssue({ code: 'custom', message: 'JSON inválido' })
      return z.NEVER as any
    }
  })
}

const schema = z.object({
  titulo: z.string().min(1),
  dataDefesa: z.string().min(1),
  resumo: z.string().min(1),
  tipoDocumentalId: z.string().transform(val => Number(val)),
  cursoId: z.string().transform(val => Number(val)),
  palavrasChave: z.string()
    .transform(val => val.split(',').map(p => p.trim()).filter(Boolean)).refine(arr => arr.length >= 3),
  autores: jsonString(z.array(pessoaSchema).min(1)),
  orientadores: jsonString(z.array(pessoaSchema).min(1)),
})

type ValidatedSchema = z.infer<typeof schema>

async function processarPessoas(
  prismaClient: any,
  trabalhoId: number,
  pessoas: PessoaInput[],
  papel: PapelPessoa
) {
  for (const p of pessoas) {
    const pessoa = await prismaClient.pessoa.upsert({
      where: { nome_sobrenome: { nome: p.nome.trim(), sobrenome: p.sobrenome.trim() } },
      update: {},
      create: { nome: p.nome.trim(), sobrenome: p.sobrenome.trim() },
    })
    await prismaClient.trabalhoPessoa.create({
      data: {
        trabalho_id: trabalhoId,
        pessoa_id: pessoa.id,
        papel: papel,
      },
    })
  }
}

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

    const validatedData: ValidatedSchema = schema.parse(formValues)

    const fileExtension = arquivoData.filename?.split('.').pop() || 'pdf'
    const uniqueFileName = `${nanoid()}.${fileExtension}`
    const uploadDir = resolve(process.cwd(), 'public/uploads')
    const filePath = `${uploadDir}/${uniqueFileName}`
    mkdirSync(uploadDir, { recursive: true })
    writeFileSync(filePath, arquivoData.data)

    const {
      cursoId,
      tipoDocumentalId,
      palavrasChave,
      autores,
      orientadores,
      ...restoDosDados
    } = validatedData;

    const novoTrabalho = await prisma.$transaction(async (tx) => {
      
      const trabalho = await tx.trabalho.create({
        data: {
          ...restoDosDados,
          dataDefesa: new Date(validatedData.dataDefesa),
          arquivo: `/uploads/${uniqueFileName}`,
          curso: { connect: { id: cursoId }, },
          tipoDocumental: { connect: { id: tipoDocumentalId }, },
          palavrasChave: {
            create: palavrasChave.map((palavraNome: string) => ({
              palavraChave: { connectOrCreate: { where: { nome: palavraNome }, create: { nome: palavraNome } } }
            }))
          },
        }
      })

      await processarPessoas(tx, trabalho.id, autores, PapelPessoa.AUTOR)
      await processarPessoas(tx, trabalho.id, orientadores, PapelPessoa.ORIENTADOR)

      return trabalho;
    })

    setResponseStatus(event, 201)
    return novoTrabalho

  } catch (error: any) {
    console.error('--- ERRO NA API DE CADASTRO DE TRABALHO ---');
    console.error(error);

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Erro de validação`,
        data: error.issues,
      })
    }
    
    if (error.code === 'P2002') {
         throw createError({
           statusCode: 409,
           statusMessage: 'Erro de conflito. Verifique se o título ou outros dados únicos já existem.',
         })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Não foi possível criar o trabalho.',
    })
  }
})
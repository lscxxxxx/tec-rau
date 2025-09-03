import prisma from '~/server/lib/prisma'
import { object, string, number, date } from 'yup'

// O schema continua o mesmo
const schema = object({
  titulo: string().required(),
  data: date().required(),
  resumo: string().required(),
  status: string().oneOf(['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']).required(),
  arquivo: string().url().required(),
  autor1: string().required(),
  orientador: string().required(),
  refbibliografica: string().required(),
  tipoTrabalhoId: number().required(),
  cursoId: number().required()
})

export default defineEventHandler(async (event) => {
  console.log('\n--- [API cadastrar] Nova requisição recebida ---');
  try {
    const body = await readBody(event)
    console.log('[API cadastrar] 1. Corpo da requisição recebido:', body);

    console.log('[API cadastrar] 2. A iniciar validação dos dados...');
    await schema.validate(body)
    console.log('[API cadastrar] 3. Validação concluída com sucesso.');

    const dadosFormatados = {
      ...body,
      data: new Date(body.data),
      tipoTrabalhoId: Number(body.tipoTrabalhoId),
      cursoId: Number(body.cursoId)
    }
    console.log('[API cadastrar] 4. Dados formatados para o Prisma:', dadosFormatados);

    console.log('[API cadastrar] 5. A tentar criar registo no banco de dados...');
    const novoTrabalho = await prisma.trabalho.create({
      data: dadosFormatados
    })
    console.log('[API cadastrar] 6. Registo criado com sucesso! ID:', novoTrabalho.id);

    setResponseStatus(event, 201)
    return novoTrabalho

  } catch (error: any) {
    // Log do erro completo no terminal para depuração
    console.error('\n--- [API cadastrar] OCORREU UM ERRO ---');
    console.error(error);
    console.error('--- FIM DO ERRO ---\n');

    if (error.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        statusMessage: `Erro de validação: ${error.message}`,
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Não foi possível criar o trabalho. Consulte o log do servidor para mais detalhes.',
    })
  }
})
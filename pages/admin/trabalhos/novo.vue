<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">

            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Novo Trabalho</h2>
                </template>

                <UForm :state="form" :validate="validate" @submit="onSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UFormField label="Título" name="titulo" class="col-span-3"
                            error="Por favor, insira o título do trabalho" required>
                            <UInput v-model="form.titulo" />
                        </UFormField>

                        <UFormField label="Data" name="data" error="Por favor, insira a data de publicação do trabalho"
                            required>
                            <UInput v-model="form.data" type="date" />
                        </UFormField>

                        <UFormField label="Status" name="status" error="Por favor, atribua um status ao trabalho"
                            required>
                            <USelect v-model="form.status"
                                :items="['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']" />
                        </UFormField>

                        <UFormField label="Tipo do trabalho" name="tipoTrabalhoId"
                            error="Por favor, selecione o tipo do trabalho" required>
                            <USelect v-model="form.tipoTrabalhoId" :items="tiposTrabalho"
                                placeholder="Selecione o tipo" />
                        </UFormField>

                        <UFormField label="Curso" name="cursoId" error="Por favor, selecione o curso do trabalho"
                            required>
                            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso" />
                        </UFormField>

                        <UFormField label="Link para o Arquivo" name="arquivo" class="col-span-3" required>
                            <UInput v-model="form.arquivo" placeholder="https://..." />
                        </UFormField>

                        <UFormField label="Autor 1" name="autor1"
                            error="Por favor, o trabalho precisa ter pelo menos um autor" required>
                            <UInput v-model="form.autor1" />
                        </UFormField>

                        <UFormField label="Autor 2" name="autor2" hint="Opcional">
                            <UInput v-model="form.autor2" />
                        </UFormField>

                        <UFormField label="Autor 3" name="autor3" hint="Opcional">
                            <UInput v-model="form.autor3" />
                        </UFormField>

                        <UFormField label="Autor 4" name="autor4" hint="Opcional">
                            <UInput v-model="form.autor4" />
                        </UFormField>

                        <UFormField label="Orientador" name="orientador"
                            error="Por favor, insira o orientador do trabalho" required>
                            <UInput v-model="form.orientador" />
                        </UFormField>

                        <UFormField label="Coorientador" name="coorientador" hint="Opcional">
                            <UInput v-model="form.coorientador" />
                        </UFormField>

                        <UFormField label="Resumo" name="resumo" class="col-span-3"
                            error="Por favor, insira o resumo do trabalho" required>
                            <UTextarea v-model="form.resumo" />
                        </UFormField>

                        <UFormField label="Referências Bibliográficas" name="refbibliografica" class="col-span-3"
                            error="Por favor, insira a referência bibliográfica do trabalho" required>
                            <UTextarea v-model="form.refbibliografica" />
                        </UFormField>
                    </div>
                    <div class="flex justify-end">
                        <UButton type="submit" :loading="loading">Cadastrar</UButton>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { object, string, number, date, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const router = useRouter()
const loading = ref(false)

const { data: cursos, error: cursosError } = await useFetch('/api/cursos', {
    key: 'cursos-para-cadastro',
    transform: (data: any[]) => Array.isArray(data) ? data.map(c => ({ label: c.curso, value: c.id })) : [],
    default: () => []
})
const { data: tiposTrabalho, error: tiposError } = await useFetch('/api/tipos-trabalho', {
    key: 'tipos-para-cadastro',
    transform: (data: any[]) => Array.isArray(data) ? data.map(t => ({ label: t.descricao, value: t.id })) : [],
    default: () => []
})
if (cursosError.value || tiposError.value) {
    toast.add({ title: 'Erro ao carregar dados', description: 'Não foi possível buscar os cursos ou tipos de trabalho.', color: 'error' })
}

const form = ref({
    titulo: '',
    data: '',
    resumo: '',
    status: 'PENDENTE',
    arquivo: '',
    autor1: '',
    autor2: '',
    autor3: '',
    autor4: '',
    orientador: '',
    coorientador: '',
    refbibliografica: '',
    tipoTrabalhoId: undefined as number | undefined,
    cursoId: undefined as number | undefined
})

const schema = object({
    titulo: string().required('Título é obrigatório'),
    data: date().required('Data é obrigatória'),
    resumo: string().required('Resumo é obrigatório'),
    status: string().oneOf(['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']).required('Status é obrigatório'),
    arquivo: string().url('Deve ser uma URL válida').required('O link para o arquivo é obrigatório'),
    autor1: string().required('Pelo menos um autor é obrigatório'),
    orientador: string().required('Orientador é obrigatório'),
    refbibliografica: string().required('Referências são obrigatórias'),
    tipoTrabalhoId: number().typeError('Selecione um tipo').required('Tipo do trabalho é obrigatório'),
    cursoId: number().typeError('Selecione um curso').required('Curso é obrigatório')
})

type Schema = InferType<typeof schema>

async function validate(state: any): Promise<any[]> {
    console.log('--- [VALIDAÇÃO] A função validate foi chamada! ---');
    try {
        await schema.validate(state, { abortEarly: false })
        console.log('[VALIDAÇÃO] A validação passou com sucesso.');
        return []
    } catch (err: any) {
        console.error('[VALIDAÇÃO] A validação FALHOU! Erros encontrados:', err.inner);
        return err.inner
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log('--- [FORMULÁRIO] Função onSubmit foi chamada! ---');
    loading.value = true
    try {
        console.log('[FORMULÁRIO] 1. Dados a serem enviados:', event.data);
        console.log('[FORMULÁRIO] 2. A tentar executar $fetch...');
        await $fetch('/api/trabalhos', {
            method: 'POST',
            body: event.data
        })
        console.log('[FORMULÁRIO] 3. $fetch concluído com sucesso!');

        toast.add({ title: 'Trabalho cadastrado com sucesso!', color: 'success', icon: 'i-lucide-check-circle' })
        await router.push('/admin/trabalhos')

    } catch (err: any) {
        console.error('--- [FORMULÁRIO] OCORREU UM ERRO ---');
        console.error('Este é o objeto de erro completo:', err);
        console.error('--- FIM DO ERRO ---');
        toast.add({ title: 'Erro ao cadastrar', description: err.data?.statusMessage || 'Tente novamente.', color: 'error', icon: 'i-lucide-x-circle' })
    } finally {
        console.log('[FORMULÁRIO] 4. Bloco finally executado.');
        loading.value = false
    }
}
</script>
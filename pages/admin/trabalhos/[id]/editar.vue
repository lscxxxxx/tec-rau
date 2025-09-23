<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">

            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Novo Trabalho</h2>
                </template>

                <UForm :schema="schema" :state="form" class="space-y-6" @submit="onSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UFormField label="Título" name="titulo" required>
                            <UInput v-model="form.titulo" />
                        </UFormField>

                        <UFormField label="Data" name="data" required>
                            <UInput v-model="form.data" type="date" />
                        </UFormField>

                        <UFormField label="Resumo" name="resumo" required>
                            <UTextarea v-model="form.resumo" />
                        </UFormField>

                        <UFormField label="Link para o Arquivo" name="arquivo" required>
                            <UInput type="file" @change="onFileChange" accept=".pdf" />
                        </UFormField>

                        <UFormField label="Status" name="status" required>
                            <USelect v-model="form.status"
                                :items="['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']" />
                        </UFormField>

                        <UFormField label="Autor 1" name="autor1" required>
                            <UInput v-model="form.autor1" />
                        </UFormField>

                        <UFormField label="Autor 2" name="autor2">
                            <UInput v-model="form.autor2" />
                        </UFormField>

                        <UFormField label="Autor 3" name="autor3">
                            <UInput v-model="form.autor3" />
                        </UFormField>

                        <UFormField label="Autor 4" name="autor4">
                            <UInput v-model="form.autor4" />
                        </UFormField>

                        <UFormField label="Orientador" name="orientador" required>
                            <UInput v-model="form.orientador" />
                        </UFormField>

                        <UFormField label="Coorientador" name="coorientador" required>
                            <UInput v-model="form.coorientador" />
                        </UFormField>

                        <UFormField label="Referências Bibliográficas" name="refbibliografica" required>
                            <UTextarea v-model="form.refbibliografica" />
                        </UFormField>

                        <UFormField label="Tipo do trabalho" name="tipoTrabalhoId" required>
                            <USelect v-model="form.tipoTrabalhoId" :items="tiposTrabalho"
                                placeholder="Selecione o tipo" />
                        </UFormField>

                        <UFormField label="Curso" name="cursoId" required>
                            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso" />
                        </UFormField>
                    </div>

                    <div class="flex justify-end">
                        <UButton type="submit" :loading="loading" class="mt-4">Atualizar</UButton>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts" async>
import { ref, onMounted } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const trabalhoId = computed(() => route.params.id as string)

const { data: cursos } = useFetch('/api/cursos', {
    transform: data => data.map((c: any) => ({ label: c.curso, value: c.id })),
    default: () => []
})
const { data: tiposTrabalho } = useFetch('/api/tipos-trabalho', {
    transform: data => data.map((t: any) => ({ label: t.descricao, value: t.id })),
    default: () => []
})

const statusOptions = ['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']

const form = reactive({
    titulo: '',
    data: '',
    resumo: '',
    status: 'PENDENTE' as const,
    arquivo: null as File | null,
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

interface Trabalho {
    titulo: string
    data: string
    resumo: string
    status: 'APROVADO' | 'REPROVADO' | 'PENDENTE' | 'PUBLICADO'
    arquivo: string | null
    autor1: string
    autor2: string | null
    autor3: string | null
    autor4: string | null
    orientador: string
    coorientador: string | null
    refbibliografica: string
    tipoTrabalhoId: number
    cursoId: number
}

const { data: trabalhoData } = await useFetch<Trabalho>(`/api/trabalhos/${trabalhoId.value}`)
if (trabalhoData.value) {
    Object.assign(form, {
        ...trabalhoData.value,
        data: new Date(trabalhoData.value.data).toISOString().split('T')[0],
        arquivo: null,
    })
}

const schema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    data: z.string().min(1, 'Data é obrigatória'),
    resumo: z.string().min(1, 'Resumo é obrigatório'),
    status: z.enum(['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']),
    arquivo: z.instanceof(File).optional().nullable(),
    autor1: z.string().min(1, 'Pelo menos um autor é obrigatório'),
    orientador: z.string().min(1, 'Orientador é obrigatório'),
    refbibliografica: z.string().min(1, 'Referências são obrigatórias'),
    tipoTrabalhoId: z.number({ required_error: 'Tipo do trabalho é obrigatório' }),
    cursoId: z.number({ required_error: 'Curso é obrigatório' }),
    autor2: z.string().optional(),
    autor3: z.string().optional(),
    autor4: z.string().optional(),
    coorientador: z.string().optional(),
})

type Schema = z.output<typeof schema>

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
        form.arquivo = input.files[0]
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    const formData = new FormData()

    for (const key in event.data) {
        if (key !== 'arquivo')
            formData.append(key, (event.data as any)[key])
    }

    if (form.arquivo)
        formData.append('arquivo', form.arquivo)

    try {
        await $fetch(`/api/trabalhos/${trabalhoId.value}`, {
            method: 'PUT',
            body: formData,
        })
        toast.add({ title: 'Trabalho atualizado com sucesso!', color: 'success' })
        await router.push('/admin/trabalhos')
    }
    catch (err: any) {
        toast.add({ title: 'Erro ao atualizar', description: err.data?.message || 'Tente novamente.', color: 'warning' })
    }
}
</script>
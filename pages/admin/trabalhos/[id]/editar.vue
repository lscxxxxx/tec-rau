<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-4xl mx-auto w-full p-1">

            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Editar Trabalho</h2>
                </template>

                <UForm :schema="schema" :state="form" @submit="onSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-3">
                        <UFormField label="Título" name="titulo" class="col-span-3 font-medium text-gray-900" required>
                            <UInput v-model="form.titulo" class="w-full" />
                        </UFormField>

                        <UFormField label="Data" name="data" required>
                            <UInput v-model="form.data" type="date" class="w-full" />
                        </UFormField>

                        <UFormField label="Status" name="status" required>
                            <USelect v-model="form.status" :items="['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']"
                                class="w-full" />
                        </UFormField>

                        <UFormField label="Tipo documental" name="tipoTrabalhoId" required>
                            <USelect v-model="form.tipoTrabalhoId" :items="tiposTrabalho" placeholder="Selecione o tipo"
                                class="w-full" />
                        </UFormField>

                        <UFormField label="Curso" name="cursoId" required>
                            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso"
                                class="w-full" />
                        </UFormField>

                        <UFormField label="Arquivo" name="arquivo" required>
                            <UFileUpload label="Selecione ou arraste o arquivo" description="PDF (max. 5MB)"
                                v-model="form.arquivo" accept=".pdf" class="w-full" />
                            <p v-if="arquivoExistente" class="text-sm text-gray-500 mt-1">
                                Arquivo atual:
                                <a :href="arquivoExistente" target="_blank" class="underline text-blue-600">Ver PDF</a>
                            </p>
                        </UFormField>

                        <UFormField label="Autor 1" name="autor1" class="col-span-3" required>
                            <UInput v-model="form.autor1" class="w-full" />
                        </UFormField>

                        <UFormField label="Autor 2" name="autor2" class="col-span-3">
                            <UInput v-model="form.autor2" class="w-full" />
                        </UFormField>

                        <UFormField label="Autor 3" name="autor3" class="col-span-3">
                            <UInput v-model="form.autor3" class="w-full" />
                        </UFormField>

                        <UFormField label="Autor 4" name="autor4" class="col-span-3">
                            <UInput v-model="form.autor4" class="w-full" />
                        </UFormField>

                        <UFormField label="Orientador" name="orientador" class="col-span-3" required>
                            <UInput v-model="form.orientador" class="w-full" />
                        </UFormField>

                        <UFormField label="Coorientador" name="coorientador" class="col-span-3">
                            <UInput v-model="form.coorientador" class="w-full" />
                        </UFormField>

                        <UFormField label="Resumo" name="resumo" class="col-span-3" required>
                            <UTextarea v-model="form.resumo" class="w-full" autoresize />
                        </UFormField>

                        <UFormField label="Referências Bibliográficas" name="refbibliografica" class="col-span-3"
                            required>
                            <UTextarea v-model="form.refbibliografica" class="w-full" autoresize />
                        </UFormField>

                        <UFormField label="Palavras-chave" name="palavrasChave" class="col-span-3">
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2">
                                    <UInput v-model="novaPalavraInput" placeholder="Digite uma palavra e aperte Enter"
                                        class="flex-1" @keydown.enter.prevent="adicionarPalavra" />
                                    <UButton icon="i-heroicons-plus" aria-label="Adicionar palavra-chave"
                                        @click="adicionarPalavra" />
                                </div>
                                <div v-if="form.palavrasChave.length > 0" class="flex flex-wrap gap-2">
                                    <UBadge v-for="(palavra, index) in form.palavrasChave" :key="`${palavra}-${index}`"
                                        variant="subtle" size="lg">
                                        {{ palavra }}
                                        <UButton icon="i-heroicons-x-mark-20-solid" color="neutral" variant="link"
                                            size="xs" class="-mr-1" @click="removerPalavra(index)" />
                                    </UBadge>
                                </div>
                                <div v-else>
                                    <p class="text-sm text-gray-500">Nenhuma palavra-chave adicionada.</p>
                                </div>
                            </div>
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
const novaPalavraInput = ref('')

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
    cursoId: undefined as number | undefined,
    palavrasChave: [] as string[],
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
    palavrasChave: string[]
}

const arquivoExistente = ref<string | null>(null)

const { data: trabalhoData } = await useFetch<Trabalho>(`/api/trabalhos/${trabalhoId.value}`)
if (trabalhoData.value) {
    Object.assign(form, {
        ...trabalhoData.value,
        data: new Date(trabalhoData.value.data).toISOString().split('T')[0],
        arquivo: null,
        palavrasChave: trabalhoData.value.palavrasChave
            ? trabalhoData.value.palavrasChave.map((p: string) => p.trim())
            : [],
    })
    arquivoExistente.value = trabalhoData.value.arquivo
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

function adicionarPalavra() {
    const palavra = novaPalavraInput.value.trim()
    if (!palavra) return
    if (form.palavrasChave.some(p => p.toLowerCase() === palavra.toLowerCase())) {
        toast.add({ title: 'Palavra-chave já adicionada.', color: 'warning' })
        novaPalavraInput.value = ''
        return
    }
    form.palavrasChave.push(palavra)
    novaPalavraInput.value = ''
}

function removerPalavra(index: number) {
    form.palavrasChave.splice(index, 1)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    const formData = new FormData()

    Object.entries(event.data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'arquivo' && value instanceof File) {
                formData.append(key, value)
            } else if (key === 'palavrasChave' && Array.isArray(value)) {
                formData.append(key, value.join(','))
            } else if (key === 'tipoTrabalhoId' || key === 'cursoId') {
                formData.append(key, String(Number(value)))
            } else {
                formData.append(key, String(value))
            }
        }
    })

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
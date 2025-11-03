<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-4xl mx-auto w-full p-1">

            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Editar Trabalho</h2>
                </template>

                <UForm :schema="schema" :state="form" @submit="onSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-3">
                        <div class="col-span-3">
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Título *</h3>
                            <UInput v-model="form.titulo" class="w-full" />
                        </div>

                        <div>
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Data de defesa *</h3>
                            <UInput v-model="form.dataDefesa" type="date" class="w-full" />
                        </div>

                        <div>
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Tipo documental *</h3>
                            <USelect v-model="form.tipoDocumentalId" :items="tiposDocumentais"
                                placeholder="Selecione o tipo" class="w-full" />
                        </div>

                        <div>
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Curso *</h3>
                            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso"
                                class="w-full" />
                        </div>

                        <div>
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Arquivo</h3>
                            <UFileUpload label="Selecione ou arraste para substituir" description="PDF (max. 5MB)"
                                v-model="form.arquivo" accept=".pdf" class="w-full" />
                            <p v-if="arquivoExistente" class="text-sm text-gray-500 mt-1">
                                Arquivo atual:
                                <a :href="arquivoExistente" target="_blank" class="underline text-blue-600">Ver PDF</a>
                            </p>
                        </div>

                        <div class="col-span-3 space-y-3">
                            <h3 class="font-semibold text-lg border-b pb-2">Autores *</h3>

                            <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4 items-center">
                                <UInput v-model="novoAutor.nome" placeholder="Nome" class="col-span-5"
                                    @keydown.enter.prevent="adicionarAutor" />
                                <UInput v-model="novoAutor.sobrenome" placeholder="Sobrenome" class="col-span-5"
                                    @keydown.enter.prevent="adicionarAutor" />
                                <div class="col-span-2 flex justify-end">
                                    <UButton label="Adicionar" icon="i-heroicons-plus" @click="adicionarAutor" />
                                </div>
                            </div>

                            <div v-if="form.autores.length > 0" class="flex flex-wrap gap-2 pt-2">
                                <UBadge v-for="(autor, index) in form.autores" :key="`autor-${index}`" variant="subtle"
                                    size="lg">
                                    {{ autor.nome }} {{ autor.sobrenome }}
                                    <UButton icon="i-heroicons-x-mark-20-solid" color="primary" variant="link" size="xs"
                                        class="-mr-1.5" @click="removerAutor(index)" />
                                </UBadge>
                            </div>
                            <div v-else>
                                <p class="text-sm text-gray-500">Nenhum autor adicionado.</p>
                            </div>
                        </div>

                        <div class="col-span-3 space-y-3">
                            <h3 class="font-semibold text-lg border-b pb-2">Orientadores *</h3>

                            <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4 items-center">
                                <UInput v-model="novoOrientador.nome" placeholder="Nome" class="col-span-5"
                                    @keydown.enter.prevent="adicionarOrientador" />
                                <UInput v-model="novoOrientador.sobrenome" placeholder="Sobrenome" class="col-span-5"
                                    @keydown.enter.prevent="adicionarOrientador" />
                                <div class="col-span-2 flex justify-end">
                                    <UButton label="Adicionar" icon="i-heroicons-plus" @click="adicionarOrientador" />
                                </div>
                            </div>

                            <div v-if="form.orientadores.length > 0" class="flex flex-wrap gap-2 pt-2">
                                <UBadge v-for="(orientador, index) in form.orientadores" :key="`orientador-${index}`"
                                    variant="subtle" size="lg">
                                    {{ orientador.nome }} {{ orientador.sobrenome }}
                                    <UButton icon="i-heroicons-x-mark-20-solid" color="primary" variant="link" size="xs"
                                        class="-mr-1.5" @click="removerOrientador(index)" />
                                </UBadge>
                            </div>
                            <div v-else>
                                <p class="text-sm text-gray-500">Nenhum orientador adicionado.</p>
                            </div>
                        </div>

                        <div class="col-span-3">
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Resumo *</h3>
                            <UTextarea v-model="form.resumo" class="w-full" autoresize />
                        </div>

                        <div class="col-span-3">
                            <h3 class="font-semibold text-lg border-b pb-2 mb-2">Palavras-chave *</h3>
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
                                    <p class="text-sm text-gray-500">Nenhuma palavra-chave adicionada (mínimo de três
                                        palavras-chave)
                                    </p>
                                </div>
                            </div>
                        </div>
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

definePageMeta({
    layout: 'admin' // <-- Diz ao Nuxt para usar o layouts/admin.vue
});

const toast = useToast()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const novaPalavraInput = ref('')
const novoAutor = ref({ nome: '', sobrenome: '' })
const novoOrientador = ref({ nome: '', sobrenome: '' })

const trabalhoId = computed(() => route.params.id as string)

type ApiSelectOption = { id: number; nome: string }

const { data: cursosData } = useFetch<ApiSelectOption[]>('/api/cursos', { default: () => [] })
const { data: tiposData } = useFetch<ApiSelectOption[]>('/api/tiposdocumentais', { default: () => [] })

const cursos = computed(() => (cursosData.value ?? []).map((c: any) => ({ label: c.nome, value: c.id, })))
const tiposDocumentais = computed(() => (tiposData.value ?? []).map((t: any) => ({ label: t.nome, value: t.id, })))

const form = reactive<FormState>({
    titulo: '',
    dataDefesa: '',
    resumo: '',
    tipoDocumentalId: undefined,
    cursoId: undefined,
    autores: [],
    orientadores: [],
    palavrasChave: [],
    arquivo: undefined,
    idsPessoasParaRemover: [],
    idsPalavrasChaveParaRemover: []
})

interface Pessoa {
    id?: number
    nome: string
    sobrenome: string
}

interface TrabalhoPessoa {
    papel: 'AUTOR' | 'ORIENTADOR'
    pessoa: Pessoa
}

interface TrabalhoApiResponse {
    titulo: string
    dataDefesa: string
    resumo: string
    arquivo: string | null
    tipoDocumental: { id: number; nome: string }
    curso: { id: number; nome: string }
    palavrasChave: any[]
    autores: Pessoa[]
    orientadores: Pessoa[]
    pessoas: TrabalhoPessoa[]
}

interface FormState {
    titulo: string
    dataDefesa: string
    resumo: string
    tipoDocumentalId: number | undefined
    cursoId: number | undefined
    autores: Pessoa[]
    orientadores: Pessoa[]
    palavrasChave: string[]
    arquivo?: File
    idsPessoasParaRemover: number[]
    idsPalavrasChaveParaRemover: number[]
}

interface Trabalho {
    titulo: string
    dataDefesa: string
    resumo: string
    arquivo: string | null
    tipoDocumental: { id: number; nome: string }
    curso: { id: number; nome: string }
    palavrasChave: string[]
    autores: Pessoa[]
    orientadores: Pessoa[]
}

const arquivoExistente = ref<string | null>(null)

const { data: trabalhoData } = await useFetch<TrabalhoApiResponse>(`/api/trabalhos/${trabalhoId.value}`)
onMounted(() => {
    if (trabalhoData.value) {
        const t = trabalhoData.value
        form.titulo = t.titulo
        form.dataDefesa = new Date(t.dataDefesa).toISOString().split('T')[0]
        form.resumo = t.resumo
        form.tipoDocumentalId = t.tipoDocumental.id
        form.cursoId = t.curso.id
        form.autores = t.autores || [];
        form.orientadores = t.orientadores || [];
        form.palavrasChave = t.palavrasChave || []
        arquivoExistente.value = t.arquivo
    }
})

const pessoaSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    sobrenome: z.string().min(1, 'Sobrenome é obrigatório'),
})

const schema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório'),
    dataDefesa: z.string().min(1, 'Data de defesa é obrigatória'),
    resumo: z.string().min(1, 'Resumo é obrigatório'),
    tipoDocumentalId: z.number({ message: 'Tipo documental é obrigatório' }),
    cursoId: z.number({ message: 'Curso é obrigatório' }),
    arquivo: z
        .custom<File | undefined>()
        .optional()
        .refine((file) => !file || file instanceof File, 'Arquivo inválido'),
    autores: z.array(pessoaSchema).min(1, 'Adicione pelo menos um autor'),
    orientadores: z.array(pessoaSchema).min(1, 'Adicione pelo menos um orientador'),
    palavrasChave: z
        .array(z.string())
        .refine((arr) => arr.length >= 3, { message: 'São necessárias pelo menos três palavras-chave' }),
})

type Schema = z.output<typeof schema>

function adicionarAutor() {
    const nome = novoAutor.value.nome.trim();
    const sobrenome = novoAutor.value.sobrenome.trim();
    if (!nome || !sobrenome) {
        toast.add({ title: 'Preencha o nome e o sobrenome do autor.', color: 'warning' });
        return;
    }
    form.autores.push({ nome, sobrenome });
    novoAutor.value = { nome: '', sobrenome: '' };
}

function removerAutor(index: number) {
    const autorRemovido = form.autores[index]
    if (autorRemovido && autorRemovido.id) {
        form.idsPessoasParaRemover.push(autorRemovido.id)
    }
    form.autores.splice(index, 1)
}

function adicionarOrientador() {
    const nome = novoOrientador.value.nome.trim();
    const sobrenome = novoOrientador.value.sobrenome.trim();
    if (!nome || !sobrenome) {
        toast.add({ title: 'Preencha o nome e o sobrenome do orientador.', color: 'warning' });
        return;
    }
    form.orientadores.push({ nome, sobrenome });
    novoOrientador.value = { nome: '', sobrenome: '' };
}

function removerOrientador(index: number) {
    const orientadorRemovido = form.orientadores[index]
    if (orientadorRemovido && orientadorRemovido.id) {
        form.idsPessoasParaRemover.push(orientadorRemovido.id)
    }
    form.orientadores.splice(index, 1)
}

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
        if (key === 'arquivo') return
        if (value !== null && value !== undefined) {
            if (Array.isArray(value)) return
            formData.append(key, String(value))
        }
    })

    if (event.data.arquivo instanceof File) {
        formData.append('arquivo', event.data.arquivo)
    }
    if (form.autores.length > 0) {
        formData.append('autoresParaAdicionar', JSON.stringify(form.autores))
    }
    if (form.orientadores.length > 0) {
        formData.append('orientadoresParaAdicionar', JSON.stringify(form.orientadores))
    }
    if (form.idsPessoasParaRemover.length > 0) {
        formData.append('idsPessoasParaRemover', form.idsPessoasParaRemover.join(','))
    }
    if (form.palavrasChave.length > 0) {
        formData.append('palavrasChaveParaAdicionar', form.palavrasChave.join(','))
    }

    formData.append('palavrasChaveParaAdicionar', form.palavrasChave.join(','));

    try {
        await $fetch(`/api/trabalhos/${trabalhoId.value}`, { method: 'PUT', body: formData, })
        toast.add({ title: 'Trabalho atualizado com sucesso!', color: 'success' })
        await router.push('/admin/trabalhos')
    } catch (err: any) {
        toast.add({ title: 'Erro ao atualizar', description: err.data?.message || 'Tente novamente.', color: 'warning' })
    } finally {
        loading.value = false
    }
}
</script>
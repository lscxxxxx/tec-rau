<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-4xl mx-auto w-full p-1">

            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Novo Trabalho</h2>
                </template>

                <UForm :schema="schema" :state="form" @submit="onSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-3">
                        <UFormField label="Título" name="titulo" class="col-span-3" required>
                            <UInput v-model="form.titulo" class="w-full" />
                        </UFormField>

                        <UFormField label="Data de defesa" name="dataDefesa" required>
                            <UInput v-model="form.dataDefesa" type="date" class="w-full" />
                        </UFormField>

                        <UFormField label="Tipo documental" name="tipoDocumentalId" required>
                            <USelect v-model="form.tipoDocumentalId" :items="tiposDocumentais"
                                placeholder="Selecione o tipo" class="w-full" />
                        </UFormField>

                        <UFormField label="Curso" name="cursoId" required>
                            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso"
                                class="w-full" />
                        </UFormField>

                        <UFormField label="Arquivo" name="arquivo" required>
                            <UFileUpload label="Selecione ou arraste o arquivo" description="PDF (max. 5MB)"
                                v-model="form.arquivo" accept=".pdf" class="w-full" />
                        </UFormField>

                        <div class="col-span-3 space-y-3">
                            <h3 class="font-semibold text-lg border-b pb-2">Autores</h3>
                            <div v-for="(autor, index) in form.autores" :key="`autor-${index}`"
                                class="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end p-3 bg-gray-50 rounded-md">
                                <UFormField :label="`Nome do Autor ${index + 1}`" :name="`autores.${index}.nome`"
                                    class="col-span-5">
                                    <UInput v-model="autor.nome" placeholder="Nome" />
                                </UFormField>
                                <UFormField :label="`Sobrenome do Autor ${index + 1}`"
                                    :name="`autores.${index}.sobrenome`" class="col-span-5">
                                    <UInput v-model="autor.sobrenome" placeholder="Sobrenome" />
                                </UFormField>
                                <div class="col-span-2 flex justify-end">
                                    <UButton color="error" variant="soft" icon="i-heroicons-trash-20-solid"
                                        @click="removerAutor(index)" />
                                </div>
                            </div>
                            <UButton label="Adicionar Autor" icon="i-heroicons-plus-circle" @click="adicionarAutor" />
                        </div>

                        <div class=" col-span-3 space-y-3">
                            <h3 class="font-semibold text-lg border-b pb-2">Orientadores</h3>
                            <div v-for="(orientador, index) in form.orientadores" :key="`orientador-${index}`"
                                class="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-end p-3 bg-gray-50 rounded-md">
                                <UFormField :label="`Nome do Orientador ${index + 1}`"
                                    :name="`orientadores.${index}.nome`" class="col-span-5">
                                    <UInput v-model="orientador.nome" placeholder="Nome" />
                                </UFormField>
                                <UFormField :label="`Sobrenome do Orientador ${index + 1}`"
                                    :name="`orientadores.${index}.sobrenome`" class="col-span-5">
                                    <UInput v-model="orientador.sobrenome" placeholder="Sobrenome" />
                                </UFormField>
                                <div class="col-span-2 flex justify-end">
                                    <UButton color="error" variant="soft" icon="i-heroicons-trash-20-solid"
                                        @click="removerOrientador(index)" />
                                </div>
                            </div>
                            <UButton label="Adicionar Orientador" icon="i-heroicons-plus-circle"
                                @click="adicionarOrientador" />
                        </div>

                        <UFormField label="Resumo" name="resumo" class="col-span-3" required>
                            <UTextarea v-model="form.resumo" class="w-full" autoresize />
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
                        <UButton type="submit" :loading="loading">Cadastrar</UButton>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>


<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const router = useRouter()
const loading = ref(false)
const novaPalavraInput = ref('')

type ApiSelectOption = { id: number; nome: string }

const { data: cursosData } = useFetch<ApiSelectOption[]>('/api/cursos', { default: () => [] })
const { data: tiposData } = useFetch<ApiSelectOption[]>('/api/tiposdocumentais', { default: () => [] })

const cursos = computed(() =>
    (cursosData.value ?? []).map((c: any) => ({ label: c.nome, value: c.id, }))
)

const tiposDocumentais = computed(() =>
    (tiposData.value ?? []).map((t: any) => ({ label: t.nome, value: t.id, }))
)

const form = reactive({
    titulo: '',
    dataDefesa: '',
    resumo: '',
    arquivo: undefined as File | undefined,
    tipoDocumentalId: undefined as number | undefined,
    cursoId: undefined as number | undefined,
    autores: [{ nome: '', sobrenome: '' }],
    orientadores: [{ nome: '', sobrenome: '' }],
    palavrasChave: [] as string[],
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
    arquivo: z.custom<File>(val => val instanceof File, 'O arquivo é obrigatório'),
    autores: z.array(pessoaSchema).min(1, 'Adicione pelo menos um autor'),
    orientadores: z.array(pessoaSchema).min(1, 'Adicione pelo menos um orientador'),
    palavrasChave: z.array(z.string()).refine(arr => arr.length >= 3, { message: 'São necessárias pelo menos três palavras-chave', }),
})

type Schema = z.output<typeof schema>

function adicionarAutor() {
    form.autores.push({ nome: '', sobrenome: '' })
}

function removerAutor(index: number) {
    if (form.autores.length > 1) {
        form.autores.splice(index, 1)
    }
}

function adicionarOrientador() {
    form.orientadores.push({ nome: '', sobrenome: '' })
}

function removerOrientador(index: number) {
    if (form.orientadores.length > 1) {
        form.orientadores.splice(index, 1)
    }
}

function adicionarPalavra() {
    const palavra = novaPalavraInput.value.trim()

    if (!palavra) {
        return
    }

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
        if (value === null || value === undefined) return;
        if (key === 'autores' || key === 'orientadores') {
            formData.append(key, JSON.stringify(value));
        } else if (key === 'palavrasChave') {
            formData.append(key, (value as string[]).join(','));
        } else if (key === 'arquivo' && value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, String(value));
        }
    })

    try {
        await $fetch(`/api/trabalhos`, {
            method: 'POST',
            body: formData,
        })

        toast.add({ title: 'Trabalho cadastrado com sucesso!', color: 'success' })
        await router.push('/admin/trabalhos')
    }
    catch (err: any) {
        toast.add({ title: 'Erro ao cadastrar', description: err.data?.message || 'Tente novamente.', color: 'warning' })
    }
}
</script>
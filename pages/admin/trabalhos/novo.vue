<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-4xl mx-auto w-full p-1">

            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Novo Trabalho</h2>
                </template>

                <UForm :schema="schema" :state="form" @submit="onSubmit">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-3">
                        <UFormField label="Título" name="titulo" class="col-span-3 font-medium text-gray-900" required>
                            <UInput v-model="form.titulo" class="w-full"/>
                        </UFormField>

                        <UFormField label="Data" name="data" required>
                            <UInput v-model="form.data" type="date" class="w-full" />
                        </UFormField>

                        <UFormField label="Status" name="status" required>
                            <USelect v-model="form.status"
                                :items="['APROVADO', 'REPROVADO', 'PENDENTE', 'PUBLICADO']" class="w-full" />
                        </UFormField>

                        <UFormField label="Tipo documental" name="tipoTrabalhoId" required>
                            <USelect v-model="form.tipoTrabalhoId" :items="tiposTrabalho"
                                placeholder="Selecione o tipo" class="w-full" />
                        </UFormField>

                        <UFormField label="Curso" name="cursoId" required>
                            <USelect v-model="form.cursoId" :items="cursos" placeholder="Selecione o curso" class="w-full" />
                        </UFormField>

                        <UFormField label="Link para o Arquivo" name="arquivo" required>
                            <UFileUpload label="Selecione ou arraste o arquivo" description="PDF (max. 5MB)" @change="onFileChange" accept=".pdf" class="w-full" />
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

                        <UFormField label="Referências Bibliográficas" name="refbibliografica" class="col-span-3" required>
                            <UTextarea v-model="form.refbibliografica" class="w-full" autoresize />
                        </UFormField>

                        <UFormField label="Palavras-chave" name="palavrasChave" class="col-span-3" required>
                            <USelectMenu v-model="form.palavrasChave" :options="palavrasChaveExistentes" placeholder="Digite ou selecione as palavras-chave" multiple creatable searchable/>
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
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const loading = ref(false)

const { data: cursos } = useFetch('/api/cursos', {
    transform: data => data.map((c: any) => ({ label: c.curso, value: c.id })),
    default: () => []
})
const { data: tiposTrabalho } = useFetch('/api/tipos-trabalho', {
    transform: data => data.map((t: any) => ({ label: t.descricao, value: t.id })),
    default: () => []
})

const { data: palavrasChaveExistentes } = useFetch('/api/palavras-chave', {
    transform: data => data.map((pc: any) => pc.texto),
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
    palavrasChave: z.array(z.string()).min(1, 'Adicione pelo menos uma palavra-chave'),
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

    Object.entries(event.data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (key === 'arquivo')
                formData.append(key, value as File)
            else
                formData.append(key, String(value))
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
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { TooltipProvider } from 'reka-ui'

const router = useRouter()
const toast = useToast()
const isModalOpen = ref(false)
const trabalhoParaExcluirId = ref<number | null>(null)
const trabalhoSelecionado = ref<Trabalho | null>(null)

type Pessoa = {
    id: number
    nome: string
    sobrenome: string
}
type TrabalhoPessoa = {
    papel: 'AUTOR' | 'ORIENTADOR'
    pessoa: Pessoa
}
type Trabalho = {
    id: number
    titulo: string
    dataDefesa: string
    curso: { nome: string }
    pessoas: TrabalhoPessoa[]
}

const { data: trabalhos, pending, refresh } = useFetch<Trabalho[]>('/api/trabalhos', {
    key: 'trabalhos-list',
    lazy: true,
    default: () => []
})

const columns: TableColumn<Trabalho>[] = [
    { id: 'titulo', header: 'Título' },
    { id: 'dataDefesa', header: 'Data de Defesa' },
    { id: 'autores', header: 'Autor(es)' },
    { id: 'orientadores', header: 'Orientador(es)' },
    { id: 'actions', header: 'Ações' },
]

function formatarPessoas(pessoas: TrabalhoPessoa[], papel: 'AUTOR' | 'ORIENTADOR'): string {
    if (!pessoas || pessoas.length === 0) { return 'Não informado' }

    const nomesFormatados = pessoas
        .filter(p => p.papel === papel)
        .map(p => `${p.pessoa.sobrenome.toUpperCase()}, ${p.pessoa.nome}`)

    return nomesFormatados.length > 0 ? nomesFormatados.join('; ') : 'Não informado'
}

function abrirModalDeExclusao(trabalho: Trabalho) {
    trabalhoParaExcluirId.value = trabalho.id
    trabalhoSelecionado.value = trabalho
    isModalOpen.value = true
}

onMounted(() => {
    isModalOpen.value = false
    trabalhoParaExcluirId.value = null
})

watch(isModalOpen, (val) => {
    console.log('Modal aberto?', val)
})

async function confirmarExclusao() {
    if (trabalhoParaExcluirId.value === null)
        return

    try {
        await $fetch(`/api/trabalhos/${trabalhoParaExcluirId.value}`, { method: 'DELETE' })
        toast.add({ title: 'Trabalho excluído com sucesso!', color: 'success' })
        refresh()
    }
    catch (error) {
        toast.add({ title: 'Erro ao excluir o trabalho', color: 'error' })
    }
    finally {
        isModalOpen.value = false
        trabalhoParaExcluirId.value = null
        trabalhoSelecionado.value = null
    }
}
</script>

<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <TooltipProvider>
            <main class="flex-1 max-w-6xl mx-auto w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold">Listagem de Trabalhos</h1>
                    <UButton to="/admin/trabalhos/novo" icon="i-lucide-plus"
                        class="uppercase text-[12.5px] font-semibold">Adicionar Trabalho</UButton>
                </div>

                <UTable :data="trabalhos" :columns="columns" :loading="pending"
                    class="bg-white shadow-md rounded-md overflow-hidden">

                    <template #titulo-cell="{ row }">
                        <span class="break-words whitespace-normal">{{ row.original.titulo }}</span>
                    </template>

                    <template #dataDefesa-data="{ row }">
                        <span>{{ new Date(row.original.dataDefesa).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) }}</span>
                    </template>

                    <template #autores-data="{ row }">
                        <span class="text-sm">{{ formatarPessoas(row.original.pessoas, 'AUTOR') }}</span>
                    </template>

                    <template #orientadores-data="{ row }">
                        <span class="text-sm">{{ formatarPessoas(row.original.pessoas, 'ORIENTADOR') }}</span>
                    </template>

                    <template #actions-cell="{ row }">
                        <div class="flex items-center justify-end gap-2">
                            <UTooltip text="Visualizar trabalho">
                                <UButton icon="i-lucide-eye" variant="ghost" color="info" aria-label="Ver detalhes"
                                    class="cursor-pointer"
                                    @click="router.push(`/admin/trabalhos/${row.original.id}`)" />
                            </UTooltip>

                            <UTooltip text="Editar trabalho">
                                <UButton icon="i-lucide-pencil" variant="ghost" color="info" aria-label="Editar"
                                    class="cursor-pointer"
                                    @click="router.push(`/admin/trabalhos/${row.original.id}/editar`)" />
                            </UTooltip>

                            <UTooltip text="Excluir trabalho">
                                <UButton icon="i-lucide-trash-2" variant="ghost" color="warning" aria-label="Excluir"
                                    class="cursor-pointer" @click="abrirModalDeExclusao(row.original)" />
                            </UTooltip>
                        </div>
                    </template>

                    <template #loading-state>
                        <div class="flex items-center justify-center h-32">
                            <i class="i-lucide-loader-circle text-4xl animate-spin" />
                        </div>
                    </template>

                    <template #empty-state>
                        <div class="flex flex-col items-center justify-center py-6 gap-3">
                            <span class="text-sm text-gray-500">Nenhum trabalho encontrado.</span>
                            <UButton label="Adicionar Trabalho" to="/admin/trabalhos/novo" />
                        </div>
                    </template>
                </UTable>
            </main>
            <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
                <UCard class="w-full max-w-md mx-auto">
                    <template #header>
                        <h2 class="text-lg font-semibold">Confirmar exclusão</h2>
                    </template>

                    <p>Tem certeza que deseja excluir o trabalho <strong>"{{ trabalhoSelecionado?.titulo }}"</strong>?
                        Esta ação não pode ser desfeita.</p>

                    <template #footer>
                        <div class="flex justify-end gap-2 mt-4">
                            <UButton color="neutral" @click="isModalOpen = false">Cancelar</UButton>
                            <UButton color="error" @click="confirmarExclusao">Excluir</UButton>
                        </div>
                    </template>
                </UCard>
            </div>
        </TooltipProvider>
    </div>
</template>
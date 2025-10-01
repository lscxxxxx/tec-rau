<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { TooltipProvider } from 'reka-ui'

const router = useRouter()
const toast = useToast()
const isModalOpen = ref(false)
const trabalhoParaExcluirId = ref<number | null>(null)

type Trabalho = {
    id: number
    titulo: string
    data: string
    status: 'APROVADO' | 'REPROVADO' | 'PENDENTE' | 'PUBLICADO'
    autor1: string
    orientador: string
    curso: {
        curso: string
    }
    tipoTrabalho: {
        descricao: string
    }
}

const { data: trabalhos, pending, refresh } = useFetch<Trabalho[]>('/api/trabalhos', {
    key: 'trabalhos-list',
    lazy: true,
    default: () => []
})

const statusColorMap = {
    APROVADO: "primary" as const,
    PUBLICADO: "success" as const,
    REPROVADO: "error" as const,
    PENDENTE: "warning" as const
}

const columns: TableColumn<Trabalho>[] = [
    { accessorKey: 'titulo', header: 'Título' },
    { accessorKey: 'autor1', header: 'Autor Principal' },
    { accessorKey: 'curso.curso', header: 'Curso' },
    { accessorKey: 'data', header: 'Data de Publicação' },
    { accessorKey: 'status', header: 'Status' },
    { id: 'actions', header: 'Ações' }
]

function abrirModalDeExclusao(id: number) {
    trabalhoParaExcluirId.value = id
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
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <TooltipProvider>
            <main class="flex-1 max-w-6xl mx-auto w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold">Listagem de Trabalhos</h1>
                    <UButton to="/admin/trabalhos/novo" icon="i-lucide-plus">Adicionar Trabalho</UButton>
                </div>

                <UTable :data="trabalhos" :columns="columns" :loading="pending"
                    class="bg-white shadow-md rounded-md overflow-hidden">

                    <template #data-cell="{ row }">
                        <span>{{ new Date(row.original.data).toLocaleDateString('pt-BR') }}</span>
                    </template>

                    <template #status-cell="{ row }">
                        <UBadge :color="statusColorMap[row.original.status]" variant="subtle" class="capitalize">
                            {{ row.original.status.toLowerCase() }}
                        </UBadge>
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
                                    class="cursor-pointer" @click="abrirModalDeExclusao(row.original.id)" />
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

                    <p>Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</p>

                    <template #footer>
                        <div class="flex justify-end gap-2 mt-4">
                            <UButton color="neutral" @click="isModalOpen = false">Não, mantenha</UButton>
                            <UButton color="error" @click="confirmarExclusao">Sim, apague</UButton>
                        </div>
                    </template>
                </UCard>
            </div>
        </TooltipProvider>
    </div>
</template>
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { TooltipProvider } from 'reka-ui'

const router = useRouter()
const toast = useToast()

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
    {
        accessorKey: 'titulo',
        header: 'Título'
    },
    {
        accessorKey: 'autor1',
        header: 'Autor Principal'
    },
    {
        accessorKey: 'curso.curso',
        header: 'Curso'
    },
    {
        accessorKey: 'data',
        header: 'Data de Publicação'
    },
    {
        accessorKey: 'status',
        header: 'Status'
    },
    {
        id: 'actions',
        header: 'Ações'
    }
]

const excluirTrabalho = async (id: number) => {
    try {
        await $fetch(`/api/trabalhos/${id}`, { method: 'DELETE' })
        toast.add({ title: 'Trabalho excluído com sucesso!', color: "success" })
        refresh()
    } catch (error) {
        toast.add({ title: 'Erro ao excluir o trabalho', color: "warning" })
    }
}
</script>

<template>
    <TooltipProvider>
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">Listagem de Trabalhos</h1>
                <UButton to="/admin/trabalhos/cadastrar" icon="i-lucide-plus">Adicionar Trabalho</UButton>
            </div>

            <UTable :data="trabalhos" :columns="columns" :loading="pending" class="flex-1">

                <template #data-cell="{ row }">
                    <span>{{ new Date(row.original.data).toLocaleDateString('pt-BR') }}</span>
                </template>

                <template #status-cell="{ row }">
                    <UBadge :color="statusColorMap[row.original.status]" variant="subtle" class="capitalize">
                        {{ row.original.status.toLowerCase() }}
                    </UBadge>
                </template>

                <!-- Slot para renderizar os botões de ação (sintaxe corrigida) -->
                <template #actions-cell="{ row }">
                    <div class="flex items-center justify-end gap-2">
                        <UTooltip text="Visualizar trabalho">
                            <UButton icon="i-lucide-eye" variant="ghost" color="info" aria-label="Ver detalhes"
                                class="cursor-pointer"
                                @click="toast.add({ title: `Visualizando: ${row.original.titulo}` })" />
                        </UTooltip>

                        <UTooltip text="Editar trabalho">
                            <UButton icon="i-lucide-pencil" variant="ghost" color="info" aria-label="Editar"
                                class="cursor-pointer"
                                @click="router.push(`/admin/trabalhos/editar/${row.original.id}`)" />
                        </UTooltip>

                        <UTooltip text="Excluir trabalho">
                            <UButton icon="i-lucide-trash-2" variant="ghost" color="warning" aria-label="Excluir"
                                class="cursor-pointer" @click="excluirTrabalho(row.original.id)" />
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
                        <span class="text-sm">Nenhum trabalho encontrado.</span>
                        <UButton label="Adicionar Trabalho" to="/admin/trabalhos/cadastrar" />
                    </div>
                </template>
            </UTable>
        </div>
    </TooltipProvider>
</template>
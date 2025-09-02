<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Trabalho = {
    id: number
    titulo: string
    data: string // A data virá como string no JSON da API
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

// 1. BUSCA DE DADOS (DATA FETCHING)
// Usamos o useFetch do Nuxt para buscar os trabalhos da sua API.
// 'pending' é um booleano reativo que será 'true' enquanto os dados estiverem carregando.
const { data: trabalhos, pending } = useFetch<Trabalho[]>('/api/trabalhos', {
    lazy: true,
    default: () => []
})

// 2. DEFINIÇÃO DAS COLUNAS
// Este array define cada coluna da tabela, seu cabeçalho e como cada célula será renderizada.
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
        accessorKey: 'curso',
        header: 'Curso',
        cell: ({ row }) => row.original.curso?.curso || 'N/A'
    },
    {
        accessorKey: 'data',
        header: 'Data de Publicação',
        cell: ({ row }) => {
            const dataFormatada = new Date(row.original.data).toLocaleDateString('pt-BR')
            return dataFormatada
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const statusColorMap = {
                APROVADO: 'success' as const,
                PUBLICADO: 'success' as const,
                REPROVADO: 'error' as const,
                PENDENTE: 'warning' as const
            }
            const status = row.getValue('status') as keyof typeof statusColorMap

            return h(UBadge, {
                class: 'capitalize',
                variant: 'subtle',
                color: statusColorMap[status] || 'neutral'
            }, () => status.toLowerCase())
        }
    },
    {
        id: 'actions',
        header: 'Ações',
        cell: ({ row }) => {
            const items = [
                [{ label: 'Ver Detalhes' /* onClick: () => ... */ }],
                [{ label: 'Editar' /* onClick: () => ... */ }],
                [{ label: 'Excluir', class: 'text-red-500' /* onClick: () => ... */ }]
            ]

            return h('div', { class: 'text-right' }, h(UDropdownMenu, { items }, () =>
                h(UButton, {
                    icon: 'i-lucide-ellipsis-vertical',
                    color: 'neutral',
                    variant: 'ghost',
                    'aria-label': 'Actions dropdown'
                })
            ))
        }
    }
]
</script>

<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">
            Listagem de Trabalhos
        </h1>

        <UTable :data="trabalhos" :columns="columns" :loading="pending" class="flex-1">
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
</template>
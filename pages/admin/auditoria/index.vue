<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">
            <h1 class="text-3xl font-bold">Logs de Auditoria</h1>

            <UTable :data="auditorias" :columns="columns" :loading="pending"
                class="bg-white shadow-md rounded-md overflow-hidden">
                <template #id-cell="{ row }">
                    <span class="break-words whitespace-normal">{{ row.original.id }}</span>
                </template>
                <template #dataModificacao-cell="{ row }">
                    <span class="break-words whitespace-normal">{{ new
                        Date(row.original.dataModificacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) }}</span>
                </template>
                <template #acao-cell="{ row }">
                    <span class="break-words whitespace-normal">{{ row.original.acao }}</span>
                </template>
                <template #log-cell="{ row }">
                    <span class="break-words whitespace-normal">{{ row.original.log }}</span>
                </template>

                <template #loading-state>
                    <div class="flex items-center justify-center h-32">
                        <i class="i-lucide-loader-circle text-4xl animate-spin" />
                    </div>
                </template>

                <template #empty-state>
                    <div class="flex flex-col items-center justify-center py-6 gap-3">
                        <span class="text-sm text-gray-500">Nenhum log encontrado</span>
                    </div>
                </template>
            </UTable>

            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="limit" :total="totalItems" />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const toast = useToast()

const page = ref(1)
const limit = ref(10)

type AdminSimples = {
    nome: string
}
type Auditoria = {
    id: number
    dataModificacao: string
    acao: 'CREATE' | 'UPDATE' | 'DELETE'
    log: string
    admin: AdminSimples | null
}
type AuditoriaApiResponse = {
    items: Auditoria[]
    totalItems: number
    page: number
    limit: number
}
const corDaAcao = {
   'CREATE': 'green',
   'UPDATE': 'blue',
   'DELETE': 'red'
}

const key = computed(() => `auditoria-p${page.value}`)
const { data, pending, refresh } = useAsyncData(
    key.value,
    () => $fetch<AuditoriaApiResponse>(`/api/auditorias?page=${page.value}&limit=${limit.value}`),
    { default: () => ({ items: [], totalItems: 0, page: 1, limit: limit.value }), watch: [page] }
)
const auditorias = computed(() => data.value?.items ?? [])
const totalItems = computed(() => data.value?.totalItems ?? 0)

const columns: TableColumn<Auditoria>[] = [
    { id: 'id', header: 'Log' },
    { id: 'dataModificacao', header: 'Data da modificação' },
    { id: 'acao', header: 'Ação' },
    { id: 'log', header: 'Descrição' },
]
</script>
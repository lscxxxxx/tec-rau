<template>
    <div>
        <TooltipProvider>
            <main>
                <div class="flex justify-between items-center mb-6">
                    <h1>Listagem de Administradores</h1>
                    <UButton to="/admin/admins/novo" icon="i-lucide-plus" class="uppercase text-[12.5px] font-semibold">Adicionar Admin</UButton>
                </div>

                <UTable>

                </UTable>
            </main>
        </TooltipProvider>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { TooltipProvider } from 'reka-ui'

const router = useRouter()
const toast = useToast()
const isModalOpen = ref(false)
const adminParaExcluirId = ref<number | null>(null)
const adminSelecionado = ref<Admin | null>(null)

type Admin = {
    id: number
    usuario: String
    email: String
    role: 'ADMIN' | 'SUPER ADMIN'
}

const { data: admins, pending, refresh } = useFetch<Admin[]>('/api/Admins', {
    key: 'admins-list',
    lazy: true,
    default: () => []
})

const columns: TableColumn<Admin>[] = [
    { accessorKey: 'usuario', header:'Usuário' },
    { accessorKey: 'email', header:'E-mail' },
    { accessorKey: 'role', header:'Papel' },
]
</script>
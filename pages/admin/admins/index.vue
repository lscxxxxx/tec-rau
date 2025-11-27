<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold">Listagem de Administradores</h1>
                <UButton icon="i-lucide-plus" class="uppercase text-[12.5px] font-semibold"
                    @click="abrirModalAdicionar">
                    Adicionar Admin
                </UButton>
            </div>

            <UTable :data="admins" :columns="columns" :loading="pending"
                class="bg-white shadow-md rounded-md overflow-hidden">
                <template #nome-cell="{ row }">
                    <span class="font-medium">{{ row.original.nome }}</span>
                </template>

                <template #email-cell="{ row }">
                    <span>{{ row.original.email }}</span>
                </template>

                <template #papel-cell="{ row }">
                    <UBadge :color="row.original.papel === 'SUPER' ? 'primary' : 'info'">
                        {{ row.original.papel }}
                    </UBadge>
                </template>

                <template #actions-cell="{ row }">
                    <div class="flex gap-2">
                        <UButton icon="i-lucide-eye" variant="ghost" color="info" aria-label="Ver detalhes"
                            class="cursor-pointer" @click="abrirModalVisualizar(row.original || row)" />
                        <UButton icon="i-lucide-pencil" variant="ghost" color="info" aria-label="Editar"
                            class="cursor-pointer" @click="abrirModalEditar(row.original || row)" />
                        <UButton icon="i-lucide-trash-2" variant="ghost" color="warning" aria-label="Excluir"
                            class="cursor-pointer" @click="abrirModalExclusao(row.original || row)" />
                    </div>
                </template>

                <template #loading-state>
                    <div class="flex items-center justify-center h-32">
                        <i class="i-lucide-loader-circle text-4xl animate-spin" />
                    </div>
                </template>

                <template #empty-state>
                    <div class="flex flex-col items-center justify-center py-6 gap-3">
                        <span class="text-sm text-gray-500">Nenhum administrador encontrado</span>
                    </div>
                </template>
            </UTable>

            <div v-if="totalItems > limit"
                class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="limit" :total="totalItems" />
            </div>

            <div v-show="isFormModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
                <UCard class="w-full max-w-lg mx-auto">
                    <template #header>
                        <h2 class="text-lg font-semibold">
                            {{ formMode === 'add' ? 'Adicionar Admin' : formMode === 'edit' ? 'Editar Admin' :
                                'Visualizar Admin' }}
                        </h2>
                    </template>

                    <div class="space-y-4">
                        <div class="space-y-6">
                            <div>
                                <h3 class="font-semibold text-lg border-b pb-2 mb-2">
                                    Nome <span class="text-red-500">*</span>
                                </h3>
                                <UInput v-model="formState.nome" class="w-full" placeholder="Digite o nome completo"
                                    :disabled="formMode === 'view'" />
                            </div>

                            <div>
                                <h3 class="font-semibold text-lg border-b pb-2 mb-2">
                                    E-mail <span class="text-red-500">*</span>
                                </h3>
                                <UInput v-model="formState.email" type="email" class="w-full"
                                    placeholder="exemplo@email.com" :disabled="formMode === 'view'" />
                            </div>

                            <div v-if="formMode === 'add'">
                                <h3 class="font-semibold text-lg border-b pb-2 mb-2">
                                    Senha <span class="text-red-500">*</span>
                                </h3>
                                <UInput v-model="formState.senha" type="password" class="w-full"
                                    placeholder="Digite uma senha segura" />
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <div class="flex justify-end gap-2 mt-4">
                            <UButton class="cursor-pointer" color="neutral" @click="fecharModalForm">Fechar</UButton>
                            <UButton v-if="formMode !== 'view'" class="cursor-pointer" color="primary"
                                @click="salvarAdmin">
                                Salvar
                            </UButton>
                        </div>
                    </template>
                </UCard>
            </div>

            <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
                <UCard class="w-full max-w-md mx-auto">
                    <template #header>
                        <h2 class="text-lg font-semibold">Confirmar exclusão</h2>
                    </template>

                    <p>Tem certeza que deseja excluir o admin
                        <strong>"{{ adminSelecionado?.nome }}"</strong>?
                    </p>

                    <template #footer>
                        <div class="flex justify-end gap-2 mt-4">
                            <UButton class="cursor-pointer" color="neutral" @click="isDeleteModalOpen = false">Cancelar
                            </UButton>
                            <UButton class="cursor-pointer" color="error" @click="confirmarExclusao">Excluir</UButton>
                        </div>
                    </template>
                </UCard>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import type { TableColumn } from '@nuxt/ui'

definePageMeta({ layout: 'admin' })

type Admin = {
    id: number
    nome: string
    email: string
    papel: 'SUPER' | 'PADRAO'
}
type ApiResponse = {
    items: Admin[]
    totalItems: number
    page: number
    limit: number
}
type FormMode = 'add' | 'edit' | 'view'

const toast = useToast()
const page = ref(1)
const limit = ref(10)

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const formMode = ref<FormMode>('add')

const adminSelecionado = ref<Admin | null>(null)
const formState = reactive({
    id: null as number | null,
    nome: '',
    email: '',
    senha: ''
})

const key = computed(() => `admins-p${page.value}`)
const { data, pending, refresh } = useAsyncData(
    key.value,
    () => $fetch<ApiResponse>(`/api/admins?page=${page.value}&limit=${limit.value}`),
    { default: () => ({ items: [], totalItems: 0, page: 1, limit: limit.value }) }
)

const admins = computed(() => data.value?.items ?? [])
const totalItems = computed(() => data.value?.totalItems ?? 0)

const columns: TableColumn<Admin>[] = [
    { id: 'nome', header: 'Usuário' },
    { id: 'email', header: 'E-mail' },
    { id: 'papel', header: 'Papel' },
    { id: 'actions', header: 'Ações' }
]

function abrirModalAdicionar() {
    formMode.value = 'add'
    formState.id = null
    formState.nome = ''
    formState.email = ''
    formState.senha = ''
    isFormModalOpen.value = true
}
function abrirModalVisualizar(admin: Admin) {
    formMode.value = 'view'
    formState.id = admin.id
    formState.nome = admin.nome
    formState.email = admin.email
    formState.senha = '' // Senha não deve ser exibida
    isFormModalOpen.value = true
}
function abrirModalEditar(admin: Admin) {
    formMode.value = 'edit'
    formState.id = admin.id
    formState.nome = admin.nome
    formState.email = admin.email
    formState.senha = '' // Senha opcional na edição
    isFormModalOpen.value = true
}
function fecharModalForm() {
    isFormModalOpen.value = false
}
function abrirModalExclusao(admin: Admin) {
    adminSelecionado.value = admin
    isDeleteModalOpen.value = true
}

async function salvarAdmin() {
    try {
        if (formMode.value === 'add') {
            // index.post.ts
            await $fetch('/api/admins', {
                method: 'POST',
                body: {
                    nome: formState.nome,
                    email: formState.email,
                    senha: formState.senha
                }
            })
            toast.add({ title: "Admin criado com sucesso!", color: "success" })

        } else if (formMode.value === 'edit' && formState.id) {
            // [id].put.ts
            await $fetch(`/api/admins/${formState.id}`, {
                method: 'PUT',
                body: {
                    nome: formState.nome,
                    email: formState.email
                    // Senha só envia se o usuário preencheu (depende da sua API)
                }
            })
            toast.add({ title: "Admin atualizado com sucesso!", color: "success" })
        }

        refresh() 
        fecharModalForm()
        toast.add({ title: "Sucesso!", description: "Dados salvos corretamente.", color: "success" })

    } catch (err: any) {
        const msgErro = err.data?.message || "Erro ao salvar admin!"
        
        toast.add({ 
            title: "Erro", 
            description: msgErro,
            color: "error" 
        })
    }
}

async function confirmarExclusao() {
    if (!adminSelecionado.value) return

    try {
        // [id].delete.ts
        await $fetch(`/api/admins/${adminSelecionado.value.id}`, {
            method: 'DELETE',
        })
        toast.add({ title: "Admin excluído com sucesso!", color: "success" })

        // Lógica de paginação ao excluir último item
        if (admins.value.length === 1 && page.value > 1) {
            page.value--
        } else {
            refresh()
        }

    } catch (err) {
        toast.add({ title: "Erro ao excluir admin!", color: "error" })
    } finally {
        isDeleteModalOpen.value = false
        adminSelecionado.value = null
    }
}
</script>
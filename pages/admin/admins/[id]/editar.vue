<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-3xl mx-auto w-full p-6">
            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Atualizar Administrador</h2>
                </template>

                <UForm :schema="schema" :state="form" @submit="onSubmit">
                    <div>
                        <UFormField label="Usuário" name="usuario" required>
                            <UInput v-model="form.usuario" placeholder="Nome de usuário" />
                        </UFormField>

                        <UFormField label="E-mail" name="email" required>
                            <UInput v-model="form.email" type="email" placeholder="seuemail@exemplo.com" />
                        </UFormField>

                        <hr class="my-6">
                        <p class="text-sm text-gray-500">
                            Preencha os campos abaixo apenas se desejar alterar a senha.
                        </p>

                        <UFormField label="Senha" name="senha">
                            <UInput v-model="form.novaSenha" type="password" placeholder="*********" />
                        </UFormField>

                        <UFormField label="Confirme a senha" name="confirmarSenha">
                            <UInput v-model="form.confirmarNovaSenha" type="password" placeholder="*********" />
                        </UFormField>

                        <div v-if="showSenhaAtual">
                            <UFormField label="Sua senha atual" name="senhaAtual" required>
                                <UInput v-model="form.senhaAtual" type="password" placeholder="*********" />
                            </UFormField>
                        </div>

                        <div class="flex justify-end mt-6">
                            <UButton type="submit" :loading="loading">Atualizar</UButton>
                        </div>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts">
import { UInput } from '#components';
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const route = useRoute()
const toast = useToast()
const router = useRouter()

const { data: loggedInUser } = useAuth()
const adminIdBeingEdited = Number(route.params.id)

const isSuperAdmin = computed(() => false)
const isEditingSelf = computed(() => loggedInUser.value?.id === adminIdBeingEdited)

/*
const isSuperAdmin = computed(() => loggedInUser.value?.role === 'SUPER_ADMIN')
const isEditingSelf = computed(() => loggedInUser.value?.id === adminIdBeingEdited)
*/

const showSenhaAtual = computed(() => isEditingSelf.value && !isSuperAdmin.value)

const loading = ref(false)
const form = reactive({
    usuario: '',
    email: '',
    novaSenha: '',
    confirmarNovaSenha: '',
    senhaAtual: '',
})

const { data: adminData } = await useFetch(`/api/admins/${adminIdBeingEdited}`)
if (adminData.value) {
    form.usuario = adminData.value.usuario
    form.email = adminData.value.email
}

const schema = z.object({
    usuario: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    novaSenha: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres').optional().or(z.literal('')),
    confirmarNovaSenha: z.string().optional(),
    senhaAtual: z.string().optional(),
}).refine(data => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As novas senhas não coincidem',
    path: ['confirmarNovaSenha'],
}).refine(data => !data.novaSenha || !!data.confirmarNovaSenha, {
    message: 'Confirmação de senha é obrigatória',
    path: ['confirmarNovaSenha'],
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        const body = { ...event.data }
        if (showSenhaAtual.value) {
            if (!form.senhaAtual) {
                toast.add({ title: 'Erro de Validação', description: 'Você precisa informar sua senha atual para salvar.', color: 'warning' })
                return
            }
            body.senhaAtual = form.senhaAtual
        }

        await $fetch(`/api/admins/${adminIdBeingEdited}`, {
            method: 'PUT',
            body,
        })

        toast.add({ title: 'Administrador atualizado com sucesso!' })
        router.push('/admin/admins')
    }
    catch (error: any) {
        toast.add({ title: 'Erro ao atualizar', description: error.data?.message || 'Ocorreu um erro.', color: 'warning' })
    }
    finally {
        loading.value = false
    }
}
</script>
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const route = useRoute()
const toast = useToast()
const router = useRouter()

const loading = ref(false)
const success = ref(false) // Estado para mostrar a mensagem de sucesso

// Pega o token da URL (ex: /admin/redefinir-senha?token=ABC123)
const token = computed(() => route.query.token as string)

const form = reactive({
    novaSenha: '',
    confirmarNovaSenha: '',
})

// Schema de validação com Zod
const schema = z.object({
    novaSenha: z.string({ required_error: 'Senha é obrigatória' }).min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmarNovaSenha: z.string({ required_error: 'Confirmação é obrigatória' }),
}).refine(data => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarNovaSenha'],
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (!token.value) {
        toast.add({ title: 'Erro', description: 'Token de redefinição inválido ou ausente.', color: 'warning' })
        return
    }

    loading.value = true
    try {
        await $fetch('/api/admins/redefinir-senha', {
            method: 'POST',
            body: {
                token: token.value,
                novaSenha: event.data.novaSenha,
            },
        })
        success.value = true
    }
    catch (error: any) {
        toast.add({
            title: 'Erro ao redefinir a senha',
            description: error.data?.message || 'O token pode ser inválido ou ter expirado.',
            color: 'warning',
        })
    }
    finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex min-h-screen flex-col bg-gray-100 font-sans text-gray-800">
        <main class="mx-auto w-full max-w-lg flex-1 p-6">
            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Crie uma Nova Senha</h2>
                </template>
                <div v-if="success" class="text-center">
                    <p class="text-gray-600">
                        Sua senha foi redefinida com sucesso! Você já pode fazer o login com sua nova senha.
                    </p>
                    <UButton to="/admin/login" variant="link" class="mt-4">
                        Ir para o Login
                    </UButton>
                </div>
                <UForm v-else :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Nova Senha" name="novaSenha" required>
                        <UInput v-model="form.novaSenha" type="password" placeholder="Mínimo 8 caracteres" />
                    </UFormGroup>
                    <UFormGroup label="Confirme a Nova Senha" name="confirmarNovaSenha" required>
                        <UInput v-model="form.confirmarNovaSenha" type="password" />
                    </UFormGroup>
                    <div class="mt-6 flex justify-end">
                        <UButton type="submit" :loading="loading">
                            Salvar Nova Senha
                        </UButton>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>
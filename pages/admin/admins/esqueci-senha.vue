<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="mx-auto w-full max-w-lg flex-1 p-6">
            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Recuperar Senha</h2>
                </template>

                <div v-if="emailSent" class="text-center">
                    <p class="text-gray-600">
                        Se um e-mail correspondente for encontrado em nosso sistema, um link para redefinição de senha
                        foi enviado.
                    </p>
                    <UButton to="/admin/login" variant="link" class="mt-4">
                        Voltar para o Login
                    </UButton>
                </div>

                <UForm v-else :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
                    <p class="text-sm text-gray-500">
                        Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
                    </p>
                    <UFormField label="E-mail" name="email" required>
                        <UInput v-model="form.email" type="email" placeholder="seuemail@exemplo.com"
                            icon="i-lucide-mail" />
                    </UFormField>
                    <div class="flex justify-end mt-6">
                        <UButton type="submit" :loading="loading">Enviar solicitação</UButton>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const loading = ref(false)
const emailSent = ref(false)

const form = reactive({
    email: '',
})

const schema = z.object({
    email: z.string({ required_error: 'E-mail é obrigatório' }).email('Formato de e-mail inválido'),
})

type Schema = z.output<typeof schema>

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        await $fetch('/api/admins/esqueceu-senha', {
            method: 'POST',
            body: event.data,
        })
    }
    catch (error: any) {
        console.error('Erro ao solicitar redefinição de senha:', error)
    }
    finally {
        loading.value = false
        emailSent.value = true
    }
}
</script>
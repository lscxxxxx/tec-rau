<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-3xl mx-auto w-full p-6">
            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Novo Administrador</h2>
                </template>

                <UForm :state="form" :validate="validate" @submit="onSubmit">
                    <div>
                        <UFormField label="Usuário" name="usuario" required>
                            <UInput v-model="form.usuario" placeholder="Nome de usuário" />
                        </UFormField>

                        <UFormField label="E-mail" name="email" required>
                            <UInput v-model="form.email" type="email" placeholder="seuemail@exemplo.com" />
                        </UFormField>

                        <UFormField label="Senha" name="senha" required>
                            <UInput v-model="form.senha" type="password" placeholder="*********" />
                        </UFormField>

                        <UFormField label="Confirme a senha" name="confirmarSenha" required>
                            <UInput v-model="form.confirmarSenha" type="password" placeholder="*********" />
                        </UFormField>

                        <div class="flex justify-end mt-6">
                            <UButton type="submit" :loading="loading">Cadastrar</UButton>
                        </div>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts">
import { UInput } from '#components';
import { object, string, ref as yupRef, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const router = useRouter()
const loading = ref(false)

const form = ref({
    usuario: '',
    email: '',
    senha: '',
    confirmarSenha: ''
})

const schema = object({
    usuario: string().required('Usuário é obrigatório'),
    email: string().email('Email inválido').required('Email é obrigatório'),
    senha: string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .required('Senha é obrigatória'),
    confirmarSenha: string()
        .oneOf([yupRef('senha')], 'As senhas não coincidem')
        .required('Confirmação de senha é obrigatória')
})

type Schema = InferType<typeof schema>

async function validate(state: any): Promise<any[]> {
    try {
        await schema.validate(state, { abortEarly: false })
        return []
    } catch (err: any) {
        return err.inner
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        await $fetch('/api/admins', {
            method: 'POST',
            body: {
                usuario: event.data.usuario,
                email: event.data.email,
                senha: event.data.senha
            }
        })
        toast.add({ title: 'Admin cadastrado com sucesso!', color: 'success' })
        router.push('/admin/admins')
    } catch (err: any) {
        toast.add({
            title: 'Erro ao cadastrar',
            description: err.data?.statusMessage || 'Tente novamente.',
            color: 'error'
        })
    } finally {
        loading.value = false
    }
}
</script>
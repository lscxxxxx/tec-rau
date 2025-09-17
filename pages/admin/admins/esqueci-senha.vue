<template>
    <div class="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-3xl mx-auto w-full p-6">
            <UCard>
                <template #header>
                    <h2 class="text-xl font-semibold">Esqueci Minha Senha</h2>
                </template>

                <UForm :schema="schema" :state="form" @submit="onSubmit">
                    <div>
                        <UFormField label="Usuário" name="usuario" required>
                            <UInput v-model="form.usuario" placeholder="Nome de usuário" />
                        </UFormField>

                        <UFormField label="E-mail" name="email" required>
                            <UInput v-model="form.email" type="email" placeholder="seuemail@exemplo.com" />
                        </UFormField>

                        <div class="flex justify-end mt-6">
                            <UButton type="submit" :loading="loading">Enviar solicitação</UButton>
                        </div>
                    </div>
                </UForm>
            </UCard>
        </main>
    </div>
</template>
<script>
</script>
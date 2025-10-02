<template>
  <div class="min-h-screen text-gray-800 font-sans flex items-center justify-center">
    <div class="w-full max-w-xs">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-0" @submit.prevent="onLoginClick">
        <p v-if="form.error"
          class="mb-3 px-3 py-1.5 w-full border rounded border-red-400 text-sm text-center text-red-400">{{ form.error
          }}
        </p>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="usuario">
            Usuário
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="usuario" v-model="form.data.usuario" type="text" autocomplete="username" placeholder="Usuário" required>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="senha">
            Senha
          </label>
          <input
            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="senha" v-model="form.data.senha" type="password" autocomplete="current-password"
            placeholder="******************" required>
          <p v-if="!form.data.senha && form.tentouSubmeter" class="text-red-500 text-xs italic">Por favor, preencha a
            senha</p>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit" :disabled="form.pendente">Entrar</button>
        </div>
        <p class="text-center text-gray-500 text-xs">
          &copy;2025 TEC-RAU. Todos os direitos reservados.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  data: {
    usuario: '',
    senha: ''
  },
  error: '',
  tentouSubmeter: false,
  pendente: false
})

async function onLoginClick() {
  form.tentouSubmeter = true
  form.pendente = true
  form.error = ''

  try {
    const { data, error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.data.usuario,
        senha: form.data.senha
      }
    })

    if (error.value) {
      form.error = error.value?.data?.message || 'Erro inesperado.'
      return
    }

    navigateTo('/admin')
  } catch (err) {
    form.error = 'Erro de conexão.'
  } finally {
    form.pendente = false
  }
}
</script>
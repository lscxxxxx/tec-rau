<template>
	<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">

		<div class="bg-white shadow-xl rounded-2xl w-full max-w-md overflow-hidden">
			<div class="pt-6 px-8">
				<NuxtLink to="/"
					class="inline-flex items-center text-sm text-gray-500 hover:text-[#006633] font-medium transition-colors gap-1 group">
					<ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
					Voltar ao site
				</NuxtLink>
			</div>

			<div class="pt-8 pb-6 px-8 text-center">
				<div class="inline-block">
					<img src="/logo.png" alt="Logo Tec-Rau" class="h-16 w-auto mx-auto mb-4" />
				</div>
				<h2 class="uppercase text-2xl font-bold text-gray-800">Acesso Restrito</h2>
			</div>

			<form class="px-8 pb-8" @submit.prevent="onLoginClick">

				<div v-if="form.error" class="mb-5 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md animate-pulse">
					<p class="text-sm text-red-700 font-medium">{{ form.error }}</p>
				</div>

				<div class="mb-5">
					<label class="block text-gray-700 text-sm font-bold mb-2 pl-1" for="usuario">
						E-mail ou Usuário
					</label>
					<div class="relative">
						<input
							class="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-lg leading-tight focus:outline-none focus:border-[#006633] focus:ring-1 focus:ring-[#006633] transition-colors duration-200 bg-gray-50 focus:bg-white"
							id="usuario" name="login" v-model="form.data.usuario" type="text" autocomplete="username"
							placeholder="Ex: admin" required>
					</div>
					<p v-if="!form.data.usuario && form.tentouSubmeter" class="text-red-500 text-xs italic mt-2 pl-1">
						Por favor, informe seu usuário ou e-mail</p>
				</div>

				<div class="mb-8">
					<label class="block text-gray-700 text-sm font-bold mb-2 pl-1" for="senha">
						Senha
					</label>
					<div class="relative">
						<input
							class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg leading-tight focus:outline-none focus:border-[#006633] focus:ring-1 focus:ring-[#006633] transition-colors duration-200 bg-gray-50 focus:bg-white"
							:class="{ '!border-red-500 focus:!border-red-500 focus:!ring-red-500': !form.data.senha && form.tentouSubmeter }"
							id="senha" name="password" v-model="form.data.senha" :type="mostrarSenha ? 'text' : 'password'"	autocomplete="current-password" placeholder="••••••••" required>
						<button type="button" @click="mostrarSenha = !mostrarSenha"
							class="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1" :title="mostrarSenha ? 'Esconder senha' : 'Exibir senha'" :aria-label="mostrarSenha ? 'Esconder senha' : 'Exibir senha'">
							<Eye v-if="!mostrarSenha" class="w-5 h-5" />
							<EyeOff v-else class="w-5 h-5" />
						</button>
					</div>
					<p v-if="!form.data.senha && form.tentouSubmeter" class="text-red-500 text-xs italic mt-2 pl-1">Por
						favor, preencha a senha</p>
				</div>

				<div>
					<button
						class="cursor-pointer w-full bg-[#006633] hover:bg-[#00552b] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg tracking-wide shadow-sm hover:shadow-md"
						type="submit" :disabled="form.pendente">
						<span v-if="form.pendente" class="i-lucide-loader-circle animate-spin w-5 h-5"></span>
						{{ form.pendente ? 'AUTENTICANDO...' : 'ENTRAR' }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuth, type User } from '~/composables/useAuth'
import { Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: false })

// 2. Puxe o estado global do usuário
const { user, setUser } = useAuth()
const router = useRouter()

const mostrarSenha = ref(false)

const form = reactive({
	data: { usuario: '', senha: '' },
	error: '',
	tentouSubmeter: false,
	pendente: false
})

async function onLoginClick() {
	form.tentouSubmeter = true
	form.error = ''

	if (!form.data.usuario || !form.data.senha) { return }

	form.pendente = true

	try {
		const data = await $fetch<User>('/api/auth/login', {
			method: 'POST',
			body: {
				email: form.data.usuario,
				senha: form.data.senha
			}
		})
		setUser(data)
		await router.push('/admin')
	} catch (err: any) {
		if (err.statusCode === 401 || err.statusCode === 403) {
			form.error = 'Credenciais inválidas.'
		} else {
			form.error = err?.data?.message || 'Falha na conexão.'
		}
	} finally {
		form.pendente = false
	}
}
</script>
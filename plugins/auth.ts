// plugins/auth.ts

// 1. Importe a interface que você acabou de exportar
import type { User } from '~/composables/useAuth'

export default defineNuxtPlugin(async () => {
  const { user } = useAuth()

  if (user.value)
    return

  try {
    // 2. AQUI ESTÁ A CORREÇÃO: Adicionamos <User> para tipar o retorno
    const userData = await $fetch<User>('/api/auth/me', {
      retry: 0,
    })
    
    // Agora o TypeScript sabe que 'userData' é do tipo 'User' e o erro desaparece
    if (userData)
      user.value = userData
  }
  catch (error) {
    user.value = null
  }
})
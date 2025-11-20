import { useState } from '#imports'

export interface User {
  id: number
  email: string
  // alinhe com o que o seu backend realmente retorna:
  // se o banco usa 'nome' e 'papel', deixe assim:
  nome: string
  papel: 'SUPER' | 'PADRAO'
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  async function loadUser() {
    try {
      // verifica se já temos token (cookie httpOnly)
      const token = useCookie('token').value
      if (!token) {
        loading.value = false
        return
      }
      // faz a chamada ao backend que valida token (server-side)
      const me = await $fetch<User>('/api/auth/me').catch(() => null)
      if (me) user.value = me
      else user.value = null
    } catch (err) {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  function setUser(u: User | null) { 
    console.log('COMPOSABLE: setUser chamado com:', u) 
    user.value = u }

  return {
    user,
    loading,
    loadUser,
    setUser
  }
}
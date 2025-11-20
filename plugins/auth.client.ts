// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
    const { loadUser } = useAuth()
    // no client, hidrata o estado do user (não bloqueante para SSR)
    await loadUser()
})
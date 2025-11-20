// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const { user, loading } = useAuth()

    const adminPublicas = [
        '/admin/login',
        '/admin/esqueci-senha',
        '/admin/redefinir-senha'
    ]

    // DEBUG
    console.log('--- MIDDLEWARE AUTH ---')
    console.log('Navegando para:', to.path)

    if (!to.path.startsWith('/admin')) return
    if (adminPublicas.includes(to.path)) return

    // se ainda estiver carregando, aguarda até terminar (trata o F5)
    if (loading.value) {
        console.log('Middleware: A aguardar "loading"...') // DEBUG
        await new Promise<void>((resolve) => {
            const stop = watch(loading, (v) => {
                if (!v) {
                    console.log('Middleware: "loading" terminado.') // DEBUG
                    stop()
                    resolve()
                }
            })
        })
    }

    // DEBUG: Verifique os valores após o await
    console.log('Middleware: Verificando user.value (após await):', user.value)

    if (!user.value) {
        console.log('Middleware: REDIRECIONANDO para /admin/login (user.value é null)') // DEBUG
        return navigateTo('/admin/login')
    }

    console.log('Middleware: Acesso autorizado.') // DEBUG
})
import { useAuth } from "~/composables/useAuth"

export default defineNuxtRouteMiddleware((to) => {
    const { user } = useAuth()

    if (!user.value && to.path.startsWith('/admin')) {
        if (to.path === '/admin/login')
            return
        
        return navigateTo('/admin/login')
    }
})
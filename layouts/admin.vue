<template>
    <div class="flex h-screen bg-gray-100">
        <aside class="w-64 flex-shrink-0 bg-gray-200 uppercase text-gray-600 flex flex-col">
            <div class="h-16 flex items-center justify-center text-2xl font-bold">
                <a href="#"><img src="/logo.png" alt="Logo do site" class="h-10" /></a>
            </div>
            <nav class="flex-1 px-2 py-4 space-y-2">
                <NuxtLink to="/admin/trabalhos" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white"><Book />
                    Trabalhos
                </NuxtLink>
                <NuxtLink to="/admin/admins" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white"><UserCog />
                    Administradores
                </NuxtLink>
                <NuxtLink to="/admin/auditoria" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white"><History />
                    Auditoria
                </NuxtLink>
            </nav>
            <div class="p-4">
                <button @click="logout"
                    class="w-full text-left flex items-center px-4 py-2 rounded-md hover:bg-red-700 hover:text-white"><LogOut />
                    Sair
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { Book, UserCog, History, LogOut } from 'lucide-vue-next'

const router = useRouter()
const { loadUser, setUser } = useAuth()

onMounted(() => { loadUser() })

async function logout() {
    try {
        await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
        console.error("Erro ao fazer logout na API:", error)
    }
    setUser(null)
    await router.push('/admin/login')
}
</script>
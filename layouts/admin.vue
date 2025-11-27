<template>
    <div class="flex h-screen bg-gray-100">
        <aside :class="isSidebarOpen ? 'w-64' : 'w-20'"
            class="flex-shrink-0 bg-gray-200 text-gray-600 flex flex-col transition-all duration-300 border-r border-gray-300 relative">

            <div class="h-16 flex items-center justify-between px-4 text-2xl font-bold border-b border-gray-300/50">
                <div v-if="isSidebarOpen"
                    class="flex-1 flex justify-center overflow-hidden transition-opacity duration-300">
                    <a href="#"><img src="/logo.png" alt="Logo" class="h-8 object-contain" /></a>
                </div>

                <button @click="toggleSidebar"
                    class="cursor-pointer p-1.5 rounded-lg hover:bg-gray-300 text-gray-600 transition-colors"
                    :class="{ 'mx-auto': !isSidebarOpen }">
                    <PanelLeftClose v-if="isSidebarOpen" class="w-5 h-5" />
                    <PanelLeftOpen v-else class="w-5 h-5" />
                </button>
            </div>

            <nav class="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
                <NuxtLink to="/"
                    class="flex items-center py-2 rounded-md hover:bg-blue-700 hover:text-white transition-colors group text-gray-700 font-semibold"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'"
                    title="Ir para o Site (Visão Pública)">
                    <Globe class="w-6 h-6 flex-shrink-0" />
                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden transition-all duration-300 origin-left uppercase text-sm">Ver
                        Site</span>
                </NuxtLink>

                <div class="border-b border-gray-300/50 my-2 mx-2"></div>

                <NuxtLink to="/admin"
                    class="flex items-center py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors group"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'" title="Painel de Controle">

                    <LayoutDashboard class="w-6 h-6 flex-shrink-0" />

                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden transition-all duration-300 origin-left uppercase text-sm font-medium">
                        Painel
                    </span>
                </NuxtLink>

                <NuxtLink to="/admin/trabalhos"
                    class="flex items-center py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors group"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'" title="Trabalhos">
                    <Book class="w-6 h-6 flex-shrink-0" />

                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden transition-all duration-300 origin-left uppercase text-sm font-medium">
                        Trabalhos
                    </span>
                </NuxtLink>

                <NuxtLink to="/admin/admins"
                    class="flex items-center py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors group"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'" title="Administradores">

                    <UserCog class="w-6 h-6 flex-shrink-0" />

                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden transition-all duration-300 origin-left uppercase text-sm font-medium">
                        Administradores
                    </span>
                </NuxtLink>

                <NuxtLink to="/admin/auditoria"
                    class="flex items-center py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors group"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'" title="Auditoria">

                    <History class="w-6 h-6 flex-shrink-0" />

                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden transition-all duration-300 origin-left uppercase text-sm font-medium">
                        Auditoria
                    </span>
                </NuxtLink>

                <NuxtLink to="/admin/boas-praticas"
                    class="flex items-center py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors group"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-2'" title="Boas Práticas">

                    <BookCheck class="w-6 h-6 flex-shrink-0" />

                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden transition-all duration-300 origin-left uppercase text-sm font-medium">
                        Boas Práticas
                    </span>
                </NuxtLink>
            </nav>

            <div class="p-4 border-t border-gray-300/50">
                <button @click="logout"
                    class="cursor-pointer w-full flex items-center rounded-md hover:bg-red-700 hover:text-white transition-colors py-2 text-left"
                    :class="isSidebarOpen ? 'px-4 gap-3' : 'justify-center px-0'" title="Sair">

                    <LogOut class="w-6 h-6 flex-shrink-0" />

                    <span v-show="isSidebarOpen"
                        class="whitespace-nowrap overflow-hidden uppercase text-sm font-medium">
                        Sair
                    </span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden transition-all duration-300">
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { Book, UserCog, History, LogOut, PanelLeftClose, PanelLeftOpen, Globe, BookCheck, LayoutDashboard } from 'lucide-vue-next'

const router = useRouter()
const { loadUser, setUser } = useAuth()

const isSidebarOpen = ref(true)

function toggleSidebar() { isSidebarOpen.value = !isSidebarOpen.value }

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
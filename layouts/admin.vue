<template>
    <div class="flex h-screen bg-gray-100">
        <aside class="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
            <div class="h-16 flex items-center justify-center text-2xl font-bold">
                TEC-RAU Admin
            </div>
            <nav class="flex-1 px-2 py-4 space-y-2">
                <NuxtLink to="/admin/trabalhos" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700">
                    Trabalhos
                </NuxtLink>
                <NuxtLink to="/admin/admins" class="flex items-center px-4 py-2 rounded-md hover:bg-gray-700">
                    Administradores
                </NuxtLink>
            </nav>
            <div class="p-4">
                <button @click="logout"
                    class="w-full text-left flex items-center px-4 py-2 rounded-md hover:bg-red-700">
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
const router = useRouter();

function logout() {
    const token = useCookie('token'); // Usa o nome correto do cookie
    token.value = null; // Remove o cookie
    router.push('/admin/login');
}
</script>
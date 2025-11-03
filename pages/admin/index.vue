<template>
    <div class="flex items-center justify-center">
        <main>
            <div class="text-center space-y-4">
                <h1 class="uppercase text-4xl font-bold text-[#006633] tracking-wider">Central do Administrador</h1>
                <div class="p-4 flex justify-center space-x-4">
                    <UButton class="uppercase font-bold" icon="i-lucide-book-marked" size="xl" to="/admin/trabalhos">
                        Trabalhos</UButton>
                    <UButton class="uppercase font-bold" icon="i-lucide-users" size="xl" to="/admin/admins">
                        Administradores</UButton>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'admin' // <-- Diz ao Nuxt para usar o layouts/admin.vue
});
</script>
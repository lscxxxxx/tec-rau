<template>
    <header class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">

                <!-- Logo (imagem) -->
                <div>
                    <img src="/logo.png" alt="Logo do site" class="h-10 w-auto" />
                </div>

                <!-- Menu Desktop -->
                <nav class="hidden md:flex gap-8 text-gray-700 font-medium">
                    <a href="#" class="hover:text-gray-900">Início</a>
                    <a href="#" class="hover:text-gray-900">Sobre</a>
                    <a href="#" class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                        Entrar
                    </a>
                </nav>

                <!-- Menu Mobile (hambúrguer) -->
                <button @click="menuOpen = !menuOpen"
                    class="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Menu Mobile Dropdown -->
        <div v-if="menuOpen" class="md:hidden bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-3">
            <a href="#" class="block text-gray-700 hover:text-gray-900">Início</a>
            <a href="#" class="block text-gray-700 hover:text-gray-900">Sobre</a>
            <a href="#"
                class="block bg-blue-600 text-white text-center px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                Entrar
            </a>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>

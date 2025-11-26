<template>
    <header class="bg-gray-200 p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <NuxtLink to="/" title="Ir para página inicial" class="flex-shrink-0">
                <img src="/logo-simples.png" alt="Logo Tec-Rau"
                    class="h-10 w-auto transition-opacity hover:opacity-80" />
            </NuxtLink>
            <nav>
                <ul class="flex items-center space-x-4">
                    <li>
                        <NuxtLink to="/cursos" class="uppercase px-3 py-2 rounded-md text-gray-700 text-[13px] font-medium transition-colors hover:text-[#006633] hover:bg-white" active-class="bg-[#006633] !text-white font-semibold hover:bg-[#00552b]">
                            Cursos
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/sobre" class="uppercase px-3 py-2 rounded-md text-gray-700 text-[13px] font-medium transition-colors hover:text-[#006633] hover:bg-white" active-class="bg-[#006633] !text-white font-semibold hover:bg-[#00552b]">
                            Sobre
                        </NuxtLink>
                    </li>
                    <li class="h-6 w-px bg-gray-300 mx-2"></li>
                    <li>
                        <NuxtLink to="/admin/login" class="uppercase px-3 py-2 rounded-md text-gray-700 text-[13px] font-medium transition-colors hover:text-[#006633] hover:bg-white flex items-center gap-1.5"
                            active-class="bg-[#006633] !text-white font-semibold hover:bg-[#00552b]">
                            <Lock class="w-3.5 h-3.5" /> Acesso Restrito
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { Lock } from 'lucide-vue-next'
</script>
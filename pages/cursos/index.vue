<template>
    <div class="max-w-6xl mx-auto px-6 py-10">
        <div>
            <h2 class="text-2xl font-semibold mt-10 mb-4">Cursos</h2>
        </div>
        <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc magna tellus, vehicula a neque ut,
                vestibulum posuere enim. Etiam tincidunt porttitor augue, ac elementum mauris placerat at. Pellentesque
                mollis ut eros non hendrerit. Ut vel rutrum mi. Integer vel auctor magna. Donec sed urna sed nisi mollis
                euismod ac tincidunt est. Sed ut dolor neque. In volutpat aliquet lobortis. Donec lectus lectus,
                fringilla sit amet facilisis quis, efficitur nec justo. Nunc feugiat mi nisi, et aliquet sem condimentum
                at. Curabitur in sem eros. Integer gravida lorem quis erat lobortis, a cursus nunc posuere. Morbi ut
                lectus eu quam blandit pretium. In ut neque metus. Nulla condimentum tortor nulla, et condimentum velit
                malesuada in.</p>
        </div>
        <div v-if="pending" class="text-center py-10">
            Carregando cursos...
        </div>

        <div v-else-if="error" class="text-center py-10 text-red-500">
            Ocorreu um erro ao carregar os cursos.
        </div>

        <div v-else-if="cursosList && cursosList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
            <NuxtLink v-for="curso in cursosList" :key="curso.id" :to="`/cursos/${curso.id}`"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer group">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <!-- Ícone dinâmico baseado no nome do curso -->
                    <component :is="iconesCursos[curso.nome] || FolderCode" class="w-6 h-6 text-green-700" />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">{{ curso.nome }}</h3>
                </div>
            </NuxtLink>
        </div>

        <div v-else class="text-center py-10 text-gray-500">
            Nenhum curso encontrado.
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Zap, Settings, FolderCode } from 'lucide-vue-next'

interface Curso {
    id: number
    nome: string
}
interface ApiResponse {
    items: Curso[]
    totalItems: number
}

const iconesCursos: Record<string, Component> = {
    'Desenvolvimento de Sistemas': FolderCode,
    'Eletrotécnica': Zap,
    'Mecânica': Settings
}
const { data, pending, error } = useAsyncData(
    'lista-cursos',
    () => $fetch<ApiResponse>('/api/cursos'), // Ajuste o endpoint se necessário
    {
        default: () => ({ items: [], totalItems: 0 })
    }
)
const cursosList = computed(() => data.value?.items ?? [])
</script>
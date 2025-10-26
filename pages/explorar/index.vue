<template>
    <div class="px-6 md:px-16 lg:px-24">
        <div class="grid grid-cols-[auto_3fr] gap-10 py-10 items-center">
            <img src="/logo.png" alt="Logo do site" class="h-20" />
            <div>
                <h2 class="text-2xl font-semibold">Repositório Institucional do Campus Jaraguá do Sul - Rau</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nisl quam, euismod ac ante vel, venenatis auctor odio. Vivamus rutrum, orci ut accumsan mollis, dui sem vulputate orci, ut feugiat libero odio tempor massa. Fusce egestas diam ac suscipit luctus. Ut quis mattis tortor. Nulla malesuada ligula sit amet auctor consectetur.</p>
            </div>
        </div>

        <div class="bg-gray-200 rounded-lg">
            <UFieldGroup size="xl" class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
                <UInput size="xl" icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
                <USelect size="xl" multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
                <UButton size="xl" color="primary" class="uppercase font-semibold px-6" @click="buscar">Buscar
                </UButton>
            </UFieldGroup>
        </div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Comunidades</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
            <a href="#"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Eletrotécnica</h3>
                </div>
            </a>

            <a href="#"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <Settings />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Mecânica</h3>
                </div>
            </a>

            <a href="#"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <FolderCode />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Desenvolvimento de
                        Sistemas
                    </h3>
                </div>
            </a>
        </div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Facetas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
            <div>
                <h3 class="text-xl font-semibold pb-5">Tipo documental</h3>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>Projeto Integrador</h3></a>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>Seminário</h3></a>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>Artigo</h3></a>
            </div>
            <div>
                <h3 class="text-xl font-semibold pb-5">Data de publicação</h3>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>2015-2019</h3></a>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>2020-2024</h3></a>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>2025-2029</h3></a>
            </div>
            <div>
                <h3 class="text-xl font-semibold pb-5">Palavra-chave</h3>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>Automação</h3></a>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>Educação</h3></a>
                <a href="#" class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer"><h3>Usinagem</h3></a>
            </div>
        </div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Submissões recentes</h2>
        <div class="gap-5 py-5">
            <ul>
                <li v-for="(trabalho, index) in trabalhos" :key="index"
                    class="bg-gray-50 p-3 border-b border-gray-200 first:border-t hover:bg-gray-100">
                    <NuxtLink :to="`/trabalho/${trabalho.id}`"
                        class="text-blue-700 text-xl font-medium hover:underline">
                        {{ trabalho.titulo }}
                    </NuxtLink>
                    <p class="text-sm text-gray-600">{{ trabalho.autor1 }} ({{ trabalho.curso?.curso }}, {{ new
                        Date(trabalho.data).getFullYear() }})</p>
                    <p class="text-sm text-gray-600"></p>
                </li>
            </ul>
        </div>

        <div>

        </div>

        <!--- Indicadores rápidos (trabalhos disponíveis, autores cadastrados, última atualização) -->
        <!--- Atalhos -->
    </div>
</template>

<script setup lang="ts">
import { USelect } from '#components';
import { ref, watch } from 'vue'
import type { SelectItem } from '@nuxt/ui'
import { Zap, Settings, FolderCode } from 'lucide-vue-next';

const queryPesquisa = ref<string>('')

const opcoesPesquisa: SelectItem[] = [
    { label: 'Todos os campos', id: 1 },
    { label: 'Título', id: 2 },
    { label: 'Autores', id: 3 },
    { label: 'Orientadores', id: 4 },
    { label: 'Ano de publicação', id: 5 },
    { label: 'Resumo', id: 6 },
]

const opcoesSelecionadas = ref<number[]>([1])

const buscar = () => {

}

type Trabalho = {
    id: number
    titulo: string
    data: string
    autor1?: string
    curso?: { curso: string }
    tipoTrabalho?: { descricao: string }
}

const { data: trabalhos, pending } = useFetch<Trabalho[]>('/api/trabalhos', {
    key: 'trabalhos-recentes',
    default: () => [],
})

const recentes = computed(() =>
    (trabalhos.value ?? [])
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 5)
)
</script>
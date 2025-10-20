<template>
    <div class="px-6 md:px-16 lg:px-24">
        <div class="grid grid-cols-[auto_3fr] gap-10 py-10 items-center">
            <img src="/logo.png" alt="Logo do site" class="h-20" />
            <div>
                <h2 class="text-2xl font-semibold">Repositório Institucional do Campus Jaraguá do Sul - Rau</h2>
                <p>Coleta, preserva e divulga a produção acadêmica digital em todas as áreas do conhecimento.<br />
                    São os ativos do repositório, além de teses e dissertações da UFRJ, artigos científicos, livros
                    eletrônicos, capítulos de livros e trabalhos apresentados em eventos por professores, pesquisadores,
                    funcionários administrativos e alunos de mestrado e doutorado.</p>
            </div>
        </div>

        <div class="bg-gray-200 rounded-lg">
            <UFieldGroup size="xl" class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
                <UInput icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
                <USelect multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
                <UButton color="primary" class="uppercase font-semibold px-6" @click="buscar">Buscar
                </UButton>
            </UFieldGroup>
        </div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Cursos</h2>
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

        <div class="grid grid-cols-4 gap-5 py-5 items-center">
            <h2 class="text-2xl font-semibold col-span-4">Tipo documental</h2>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                Monografia</div>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                Artigo</div>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                Relatório técnico</div>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                Projeto de pesquisa</div>
        </div>

        <div class="grid grid-cols-3 gap-5 py-5 items-center">
            <h2 class="text-2xl font-semibold col-span-3">Ano de publicação</h2>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                2000 a 2009</div>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                2010 a 2019</div>
            <div
                class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 hover:bg-gray-50 hover:shadow-md transition duration-200">
                2020 a 2025</div>
        </div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Submissões recentes</h2>
        <div>
            <ul>
                <li v-for="(trabalho, index) in trabalhos" :key="index"
                    class="bg-gray-50 p-3 border-b border-gray-200 hover:bg-gray-100">
                    <a href="#" class="text-blue-700 text-xl font-medium hover:underline">{{ trabalho.titulo }}</a>
                    <p class="text-sm text-gray-600">{{ trabalho.autor1 }} ({{ trabalho.curso?.curso }}, {{ new
                        Date(trabalho.data).getFullYear() }})</p>
                </li>
            </ul>
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
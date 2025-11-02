<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">

            <UCard>
                <template #header>
                    <h2 class="uppercase text-xl font-semibold"><strong>{{ trabalho?.titulo }}</strong></h2>
                </template>
                <div v-if="pending" class="text-center py-10">
                    Carregando trabalho...
                </div>

                <div v-else-if="error" class="text-center py-10 text-red-500">
                    <h1>Erro ao carregar trabalho</h1>
                    <p>{{ error.message || error.message }}</p>
                </div>

                <div v-else-if="trabalho" class="overflow-x-auto">
                    <table class="table-auto w-full text-sm">
                        <tbody>
                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Título</th>
                                <td class="p-2 text-gray-800">{{ trabalho?.titulo }}</td>
                            </tr>

                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Autor(es)</th>
                                <td class="p-2 text-gray-800">
                                    <span v-for="autor in trabalho.autores" :key="autor.id"
                                        class="inline-block border border-[#2F9E40] bg-[rgba(47,158,64,0.25)] text-[#2F9E40] px-2 py-1 rounded mr-1 mb-1">
                                        {{ autor.nome }} {{ autor.sobrenome }}
                                    </span>
                                </td>
                            </tr>

                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Orientador(es)</th>
                                <td class="p-2 text-gray-800">
                                    <span v-for="orientador in trabalho.orientadores" :key="orientador.id"
                                        class="inline-block border border-[#2F9E40] bg-[rgba(47,158,64,0.25)] text-[#2F9E40] px-2 py-1 rounded mr-1 mb-1">
                                        {{ orientador.nome }} {{ orientador.sobrenome }}
                                    </span>
                                </td>
                            </tr>

                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Tipo documental</th>
                                <td class="p-2 text-gray-800">{{ trabalho?.tipoDocumental?.nome }}</td>
                            </tr>

                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Curso</th>
                                <td class="p-2 text-gray-800">{{ trabalho?.curso?.nome }}</td>
                            </tr>
                            
                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Palavras-chave</th>
                                <td class="p-2 text-gray-800">
                                    <span v-if="trabalho.palavrasChave.length">
                                        <span v-for="(p, idx) in trabalho.palavrasChave" :key="idx"
                                            class="inline-block border border-[#2F9E40] bg-[rgba(47,158,64,0.25)] text-[#2F9E40] px-2 py-1 rounded mr-1 mb-1">
                                            {{ p }}
                                        </span>
                                    </span>
                                </td>
                            </tr>
                            
                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Data de defesa</th>
                                <td class="p-2 text-gray-800">
                                    <ClientOnly>{{ dataFormatada }}</ClientOnly>
                                </td>
                            </tr>
                            
                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600 leading-relaxed">Resumo</th>
                                <td class="p-2 text-gray-800 leading-relaxed">{{ trabalho?.resumo }}</td>
                            </tr>
                            
                            <tr class="border-b">
                                <th class="text-left w-48 p-2 font-medium text-gray-600">Arquivo</th>
                                <td class="p-2 text-gray-800">
                                    <span v-if="trabalho.arquivo">
                                        <a :href="trabalho.arquivo" target="_blank"
                                            class="text-blue-600 hover:underline">
                                            Visualizar PDF
                                        </a>
                                    </span>
                                    <span v-else>–</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const id = computed(() => route.params.id as string)
console.log(`${id.value}`)

interface Curso {
    id: number;
    nome: string;
}

interface TipoDocumental {
    id: number;
    nome: string;
}

interface Pessoa {
    id: number
    nome: string
    sobrenome: string
}

interface Trabalho {
    id: number
    titulo: string
    resumo?: string
    refbibliografica?: string
    dataDefesa: string
    tipoDocumental?: TipoDocumental
    curso?: Curso
    autores: Pessoa[]
    orientadores: Pessoa[]
    palavrasChave: string[]
    arquivo?: string | null
}

const { data: trabalho, pending, error } = useAsyncData(
    `trabalho-${id.value}`,
    () => $fetch<Trabalho>(`/api/trabalhos/${id.value}`),
    { lazy: true }
)

const dataFormatada = computed(() => {
    if (!trabalho.value?.dataDefesa) return ''
    return new Date(trabalho.value.dataDefesa).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
})
</script>
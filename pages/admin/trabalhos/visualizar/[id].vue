<template>
    <div v-if="pending" class="text-center py-10">
        Carregando trabalho...
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
        <h1>Erro ao carregar trabalho</h1>
        <p>{{ error.statusMessage || error.message }}</p>
    </div>

    <div v-else-if="trabalho" class="overflow-x-auto">
        <table class="table-auto w-full border border-gray-300 text-sm">
            <tbody>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Título</th>
                    <td class="p-2 text-gray-800">{{ trabalho?.titulo }}</td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Autor(es)</th>
                    <td class="p-2 text-gray-800">{{ autores }}</td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Orientador(es)</th>
                    <td class="p-2 text-gray-800">{{ orientadores }}</td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Tipo documental</th>
                    <td class="p-2 text-gray-800">{{ trabalho?.tipoTrabalho?.descricao }}</td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Palavras-chave</th>
                    <td class="p-2 text-gray-800">{{ '–' }}</td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Data do documento</th>
                    <td class="p-2 text-gray-800"><ClientOnly>{{ dataFormatada }}</ClientOnly></td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Referência bibliográfica</th>
                    <td class="p-2 text-gray-800">{{ trabalho?.refbibliografica }}</td>
                </tr>
                <tr class="border-b">
                    <th class="text-left w-48 p-2 font-medium text-gray-600">Resumo</th>
                    <td class="p-2 text-gray-800">{{ trabalho?.resumo }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const id = computed(() => route.params.id as string)
console.log(`${id.value}`)

interface Trabalho {
    id: number
    titulo: string
    autor1?: string
    autor2?: string
    autor3?: string
    autor4?: string
    orientador?: string
    coorientador?: string
    resumo?: string
    refbibliografica?: string
    data: string
    tipoTrabalho?: {
        descricao: string
    }
}

const { data: trabalho, pending, error } = useAsyncData(
    `trabalho-${id.value}`, // Adicionar uma chave é uma boa prática com lazy
    () => $fetch<Trabalho>(`/api/trabalhos/${id.value}`),
    { lazy: true }
)

const dataFormatada = computed(() => {
    if (!trabalho.value?.data) return ''
    return new Date(trabalho.value.data).toLocaleDateString("pt-BR")
})

const autores = computed(() => {
    return [
        trabalho.value?.autor1,
        trabalho.value?.autor2,
        trabalho.value?.autor3,
        trabalho.value?.autor4
    ].filter(Boolean).join("; ")
})

const orientadores = computed(() => {
    return [
        trabalho.value?.orientador,
        trabalho.value?.coorientador
    ].filter(Boolean).join("; ")
})
</script>
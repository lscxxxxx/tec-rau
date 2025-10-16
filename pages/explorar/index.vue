<template>
    <div class="bg-gray-200 rounded-lg">
        <UFieldGroup size="4xl" class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
            <UInput icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
            <USelect multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
            <UButton color="primary" class="uppercase" @click="buscar">Buscar
            </UButton>
        </UFieldGroup>
    </div>

    <div class="grid grid-cols-3 gap-5 py-5 items-center">
        <h2 class="uppercase text-2xl font-bold col-span-3">Busca por cursos</h2>
        <div class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-zap-icon lucide-zap">
                <path
                    d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
            <h3 class="text-[20px] font-medium">Eletrotécnica</h3>
        </div>
        <div class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-cog-icon lucide-cog">
                <path d="M11 10.27 7 3.34" />
                <path d="m11 13.73-4 6.93" />
                <path d="M12 22v-2" />
                <path d="M12 2v2" />
                <path d="M14 12h8" />
                <path d="m17 20.66-1-1.73" />
                <path d="m17 3.34-1 1.73" />
                <path d="M2 12h2" />
                <path d="m20.66 17-1.73-1" />
                <path d="m20.66 7-1.73 1" />
                <path d="m3.34 17 1.73-1" />
                <path d="m3.34 7 1.73 1" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="12" r="8" />
            </svg>
            <h3 class="text-[20px] font-medium"><a href="#">Mecânica</a></h3>
        </div>
        <div class="flex items-center space-x-5 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-folder-code-icon lucide-folder-code">
                <path d="M10 10.5 8 13l2 2.5" />
                <path d="m14 10.5 2 2.5-2 2.5" />
                <path
                    d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
            </svg>
            <h3 class="text-[20px] font-medium"><a href="#">Desenvolvimento de Sistemas</a></h3>
        </div>
    </div>

    <!--- Incluir facetas de busca (seguir o que foi implementado na busca por cursos) -->
    <!--- Conteúdos em destaque (no caso, pode ser os mais recentes) -->
    <!--- Indicadores rápidos (trabalhos disponíveis, autores cadastrados, última atualização) -->
    <!--- Atalhos -->
</template>

<script setup lang="ts">
import { USelect } from '#components';
import { ref, watch } from 'vue'
import type { SelectItem } from '@nuxt/ui'

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

/*
watch(opcoesSelecionadas, (novosValores) => {
    const todosSelecionado = novosValores.includes(1)

    if (todosSelecionado && novosValores.length > 1) {
        opcoesSelecionadas.value = [1]
    }

    if (!todosSelecionado && novosValores.length === 0) {
        opcoesSelecionadas.value = [1]
    }
})
*/

const buscar = () => {

}
</script>
<template>
    <div class="bg-gray-200 rounded-lg">
        <UFieldGroup size="4xl" class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
            <UInput icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
            <USelect multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
            <UButton color="primary" class="uppercase" @click="buscar">Buscar
            </UButton>
        </UFieldGroup>
    </div>
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
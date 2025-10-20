<template>
    <div>
        <wordcloud></wordcloud>
    </div>
</template>

<script setup lang="ts">
import wordcloud from 'vue-wordcloud'
import { ref, onMounted } from 'vue'

const nuvem = ref<{ name: string; value: number }[]>([])

const buscaPalavras = async () => {
    const res = await $fetch('/api/palavras')
    nuvem.value = res.map((p: any) => ({
        name: p.palavra,
        value: p.trabalhosCount ?? 1
    }))
}

onMounted(buscaPalavras)

const corPalavra = (word: any, weight: number) => {
    const cores = ['#2563eb', '#16a34a', '#eab308', '#f97316', '#dc2626']
    return cores[Math.floor(Math.random() * cores.length)]
}

const tamanhoPalavra = (word: any, weight: number) => 15 + weight * 5

//TO-DO: Estático do trabalho para os usuários comuns
const onPalavraClick = (word: any) => {
    navigateTo()
}
</script>
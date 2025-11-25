<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">

            <UCard>
                <template #header>
                    <h2 class="uppercase text-xl font-semibold"><strong>{{ trabalho?.titulo }}</strong></h2>
                </template>

                <div v-if="pending" class="text-center py-10">
                    <div class="flex flex-col items-center gap-2">
                        <i class="i-lucide-loader-circle text-4xl animate-spin text-primary-500" />
                        <span>Carregando trabalho...</span>
                    </div>
                </div>

                <div v-else-if="error" class="text-center py-10 text-red-500">
                    <h1 class="text-lg font-bold">Erro ao carregar trabalho</h1>
                    <p>{{ error.message || 'Ocorreu um erro desconhecido.' }}</p>
                </div>

                <div v-else-if="trabalho" class="overflow-x-auto">
                    <!-- Estrutura baseada em Description List (DL) com Grid -->
                    <dl class="text-sm divide-y divide-gray-200 rounded-lg overflow-hidden border border-gray-200">

                        <!-- Título -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Título</dt>
                            <dd class="col-span-4 font-medium text-gray-800 pr-6">
                                {{ trabalho?.titulo }}
                            </dd>
                        </div>

                        <!-- Autor(es) -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Autor(es)</dt>
                            <dd class="col-span-4 text-gray-800 flex flex-wrap pr-6 gap-y-1">
                                <span v-for="autor in trabalho.autores" :key="autor.id"
                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[rgba(47,158,64,0.15)] text-[#2F9E40] border border-[rgba(47,158,64,0.3)] mr-1">
                                    {{ autor.sobrenome.toUpperCase() }}, {{ autor.nome }}
                                </span>
                            </dd>
                        </div>

                        <!-- Orientador(es) -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Orientador(es)
                            </dt>
                            <dd class="col-span-4 text-gray-800 flex flex-wrap pr-6 gap-y-1">
                                <span v-for="orientador in trabalho.orientadores" :key="orientador.id"
                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[rgba(47,158,64,0.15)] text-[#2F9E40] border border-[rgba(47,158,64,0.3)] mr-1">
                                    {{ orientador.sobrenome.toUpperCase() }}, {{ orientador.nome }}
                                </span>
                            </dd>
                        </div>

                        <!-- Tipo documental -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Tipo documental
                            </dt>
                            <dd class="col-span-4 font-medium text-gray-600 pr-6">
                                {{ trabalho?.tipoDocumental?.nome }}
                            </dd>
                        </div>

                        <!-- Curso -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Curso</dt>
                            <dd class="col-span-4 font-medium text-gray-600 pr-6">
                                {{ trabalho?.curso?.nome }}
                            </dd>
                        </div>

                        <!-- Palavras-chave -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Palavras-chave
                            </dt>
                            <dd class="col-span-4 text-gray-800 flex flex-wrap pr-6 gap-y-1">
                                <span v-if="trabalho.palavrasChave && trabalho.palavrasChave.length">
                                    <span v-for="(p, idx) in trabalho.palavrasChave" :key="idx"
                                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-[rgba(47,158,64,0.15)] text-[#2F9E40] border border-[rgba(47,158,64,0.3)] mr-1">
                                        {{ p.nome }}
                                    </span>
                                </span>
                                <span v-else class="text-gray-400 italic">Nenhuma informada</span>
                            </dd>
                        </div>

                        <!-- Data de defesa -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Data de defesa
                            </dt>
                            <dd class="col-span-4 font-medium text-gray-600 pr-6">
                                <ClientOnly>{{ dataFormatada }}</ClientOnly>
                            </dd>
                        </div>

                        <!-- Resumo -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-900 col-span-1 pl-4 pt-1">Resumo</dt>
                            <dd class="col-span-4 font-medium text-gray-600 text-justify leading-relaxed pr-6">
                                {{ trabalho?.resumo }}
                            </dd>
                        </div>

                        <!-- Arquivo -->
                        <div
                            class="grid grid-cols-5 gap-4 py-3 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-4 flex items-center">Arquivo</dt>
                            <dd class="col-span-4 text-gray-800 flex items-center gap-4 pr-6">
                                <template v-if="trabalho.arquivo">
                                    <a :href="trabalho.arquivo" target="_blank" rel="noopener noreferrer"
                                        class="inline-flex items-center text-green-700 font-medium hover:underline hover:text-green-800 transition-colors">
                                        <Eye class="w-4 h-4 mr-2" />Visualizar PDF
                                    </a>

                                    <a :href="trabalho.arquivo" download
                                        class="inline-flex items-center text-green-700 font-medium hover:underline hover:text-green-800 transition-colors">
                                        <Download class="w-4 h-4 mr-2" />Baixar PDF
                                    </a>
                                </template>
                                <span v-else class="text-gray-400 italic">Nenhum arquivo anexado</span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Eye, Download } from 'lucide-vue-next'

definePageMeta({
    layout: 'admin'
});

const route = useRoute()
const id = computed(() => route.params.id as string)

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
interface PalavraChave {
    id: number
    nome: string
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
    palavrasChave: PalavraChave[]
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
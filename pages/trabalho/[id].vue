<template>
    <div class="min-h-screen text-gray-800 font-sans flex flex-col">
        <main class="flex-1 max-w-6xl mx-auto w-full p-6">

            <nav class="flex items-center text-sm text-gray-600 mb-4">
                <template v-for="(p, idx) in paginas" :key="idx">
                    <div class="flex items-center">
                        <NuxtLink v-if="p.to" :to="p.to"
                            class="flex items-center gap-1 hover:underline hover:text-green-700 transition-colors">
                            <component v-if="p.icon" :is="p.icon" class="w-4 h-4 mr-1 text-green-700" />{{ p.label }}
                        </NuxtLink>
                        <span v-else class="flex items-center gap-1">
                            <component v-if="p.icon" :is="p.icon" class="w-4 h-4 mr-1 text-gray-600" />{{ p.label }}
                        </span>
                        <ChevronRight v-if="idx < paginas.length - 1" class="mx-2 text-gray-400" />
                    </div>
                </template>
            </nav>


            <UCard>
                <template #header>
                    <h2 class="uppercase text-xl font-semibold"><strong>{{ trabalho?.titulo }}</strong></h2>
                </template>
                <div v-if="pending" class="text-center py-10">
                    Carregando trabalho...
                </div>

                <div v-else-if="error" class="text-center py-10 text-red-500">
                    <h1>Erro ao carregar trabalho</h1>
                    <p>{{ error.statusMessage || error.message }}</p>
                </div>

                <div v-else-if="trabalho" class="overflow-x-auto">
                    <dl class="text-sm divide-y divide-gray-200 rounded-lg overflow-hidden">
                        <!-- Título -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Título</dt>
                            <dd class="col-span-3 font-medium text-gray-600">
                                {{ trabalho?.titulo }}
                            </dd>
                        </div>

                        <!-- Autor(es) -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Autor(es)</dt>
                            <dd class="col-span-3 text-gray-800 flex flex-wrap">
                                <span v-for="autor in trabalho.autores" :key="autor.id"
                                    class="inline-flex items-center rounded-full px-2 py-1 text-sm font-medium bg-[rgba(47,158,64,0.25)] text-[#2F9E40] mr-1">
                                    <NuxtLink to="#" class="hover:underline">
                                        {{ autor.sobrenome.toUpperCase() }}, {{ autor.nome }}
                                    </NuxtLink>
                                </span>
                            </dd>
                        </div>

                        <!-- Orientador(es) -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Orientador(es)</dt>
                            <dd class="col-span-3 text-gray-800 flex flex-wrap">
                                <span v-for="orientador in trabalho.orientadores" :key="orientador.id"
                                    class="inline-flex items-center rounded-full px-2 py-1 text-sm font-medium bg-[rgba(47,158,64,0.25)] text-[#2F9E40] mr-1">
                                    <NuxtLink to="#" class="hover:underline">
                                        {{ orientador.sobrenome.toUpperCase() }}, {{ orientador.nome }}
                                    </NuxtLink>
                                </span>
                            </dd>
                        </div>

                        <!-- Tipo documental -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Tipo documental</dt>
                            <dd class="col-span-3 font-medium text-gray-600">
                                {{ trabalho?.tipoDocumental?.nome }}
                            </dd>
                        </div>

                        <!-- Curso -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Curso</dt>
                            <dd class="col-span-3 font-medium text-gray-600">
                                {{ trabalho?.curso?.nome }}
                            </dd>
                        </div>

                        <!-- Palavras-chave -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Palavras-chave</dt>
                            <dd class="col-span-3 text-gray-800 flex flex-wrap">
                                <span v-for="(p, idx) in trabalho.palavrasChave" :key="idx"
                                    class="inline-flex items-center rounded-full px-2 py-1 text-sm font-medium bg-gray-300 text-gray-700 mr-1">
                                    <NuxtLink to="#" class="hover:underline">{{ p }}</NuxtLink>
                                </span>
                            </dd>
                        </div>

                        <!-- Data de defesa -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Data de defesa</dt>
                            <dd class="col-span-3 font-medium text-gray-600">
                                <ClientOnly>{{ dataFormatada }}</ClientOnly>
                            </dd>
                        </div>

                        <!-- Resumo -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-900 col-span-1 pl-3">Resumo</dt>
                            <dd class="col-span-3 font-medium text-gray-600 text-justify leading-relaxed pr-3">
                                {{ trabalho?.resumo }}
                            </dd>
                        </div>

                        <!-- Arquivo -->
                        <div
                            class="grid grid-cols-4 gap-4 py-2 even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition-colors">
                            <dt class="font-semibold text-gray-600 col-span-1 pl-3">Arquivo</dt>
                            <dd class="col-span-3 text-gray-800 flex items-center gap-4">
                                <template v-if="trabalho.arquivo">
                                    <a :href="trabalho.arquivo" target="_blank" rel="noopener noreferrer"
                                        class="inline-flex items-center text-green-700 font-medium hover:underline">
                                        <Eye class="w-4 h-4 mr-2" />Visualizar PDF
                                    </a>

                                    <a :href="trabalho.arquivo" download
                                        class="inline-flex items-center text-green-700 font-medium hover:underline">
                                        <Download class="w-4 h-4 mr-2" />Baixar PDF
                                    </a>
                                </template>
                                <span v-else>–</span>
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
import { Zap, Settings, FolderCode, Home, ChevronRight, Eye, Download } from 'lucide-vue-next'

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
interface Pagina {
    label: string
    to?: string
    icon?: any
}

const iconesCursos: Record<string, any> = {
    'Desenvolvimento de Sistemas': FolderCode,
    'Eletrotécnica': Zap,
    'Mecânica': Settings
}

const { data: trabalho, pending, error } = useAsyncData(
    `trabalho-${id.value}`,
    () => $fetch<Trabalho>(`/api/trabalhos/${id.value}`),
    { lazy: true }
)

const paginas = computed<Pagina[]>(() => {
    const t = trabalho.value
    if (!t) { return [{ label: 'Página Inicial', to: '/explorar' }, { label: 'Carregando...' }] }

    const curso = t.curso
    const IconeCurso = iconesCursos[curso?.nome ?? ''] || FolderCode

    const lista: Pagina[] = [
        { label: 'Página Inicial', to: '/explorar', icon: Home }
    ]

    if (curso) {
        lista.push({ label: curso.nome, to: `/cursos/${curso.id}`, icon: IconeCurso })
    }

    lista.push({ label: t.titulo })
    return lista
})

const dataFormatada = computed(() => {
    if (!trabalho.value?.dataDefesa) return ''
    return new Date(trabalho.value.dataDefesa).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
})
</script>
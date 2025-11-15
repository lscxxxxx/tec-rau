<template>
    <div class="px-6 md:px-16 lg:px-24">
        <div class="grid grid-cols-[auto_3fr] gap-10 py-10 items-center">
            <img src="/logo.png" alt="Logo do site" class="h-20" />
            <div>
                <h2 class="text-2xl font-semibold">Repositório Institucional do Campus Jaraguá do Sul - Rau</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nisl quam, euismod ac ante vel,
                    venenatis auctor odio. Vivamus rutrum, orci ut accumsan mollis, dui sem vulputate orci, ut feugiat
                    libero odio tempor massa. Fusce egestas diam ac suscipit luctus. Ut quis mattis tortor. Nulla
                    malesuada ligula sit amet auctor consectetur.</p>
            </div>
        </div>

        <div class="bg-gray-200 rounded-lg">
            <div class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
                <UInput size="xl" icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
                <USelect size="xl" multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
                <UButton size="xl" color="primary" class="uppercase font-semibold px-6" @click="buscar"
                    @keydown.enter="buscar">Buscar
                </UButton>
            </div>
        </div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Comunidades</h2>
        <div v-if="pendingCursos" class="text-center py-10">Carregando comunidades...</div>
        <div v-else-if="errorCursos" class="py-10 text-center text-red-500">Erro ao carregar comunidades</div>
        <div v-else-if="cursosList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
            <NuxtLink v-for="curso in cursosList" :key="curso.id" :to="`/explorar?cursoId=${curso.id}`"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer grou">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <component :is="iconesCursos[curso.nome] || FolderCode" class="w-6 h-6 text-green-700" />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">{{ curso.nome }}</h3>
                </div>
            </NuxtLink>
        </div>
        <div v-else class="py-10 text-center text-gray-500">Nenhuma comunidade encontrada</div>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Facetas</h2>
        <UAccordion :items="accordionItems">
            <template #tipos>
                <div class="space-y-2 p-2">
                    <NuxtLink v-for="tipo in tiposDocumentais" :key="tipo.id"
                        :to="`/pesquisa?tipoDocumentalId=${tipo.id}`" class="">{{ tipo.nome }}</NuxtLink>
                </div>
            </template>
            <template #autores>
                <div class="space-y-2 p-2">
                    <NuxtLink v-for="autor in autoresPopulares" :key="autor.id" :to="`/pesquisa?pessoaId=${autor.id}`"
                        class="">{{ autor.sobrenome.toUpperCase() }}, {{ autor.nome }}</NuxtLink>
                </div>
            </template>
            <template #palavras>
                <div class="space-y-2 p-2">
                    <NuxtLink v-for="palavra in palavrasChavePopulares" :key="palavra.id"
                        :to="`/pesquisa?palavraChaveId=${palavra.id}`" class="">{{ palavra.nome }}</NuxtLink>
                </div>
            </template>
        </UAccordion>

        <h2 class="text-2xl font-semibold mt-10 mb-4">Submissões recentes</h2>
        <div v-if="pending" class="text-center py-10">Carregando trabalhos...</div>
        <div v-else-if="error" class="py-10 text-center text-red-500">Ocorreu um erro ao carregar os trabalhos</div>
        <div v-else-if="trabalhosRecentes.length > 0" class="gap-5 py-5">
            <ul class="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                <li v-for="trabalho in trabalhosRecentes" :key="trabalho.id"
                    class="bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                    <NuxtLink :to="`/trabalho/${trabalho.id}`"
                        class="text-blue-700 text-xl font-medium hover:underline">{{
                            trabalho.titulo }}</NuxtLink>
                    <p class="text-sm text-gray-600">{{ formatarAutores(trabalho.pessoas) }}
                        ({{ trabalho.curso?.nome }}, {{ new Date(trabalho.dataDefesa).getFullYear() }})</p>
                </li>
            </ul>
        </div>
        <div v-else class="py-10 text-center text-gray-500">Nenhuma submissão recente encontrada</div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 py-5 text-center my-10 bg-gray-50 p-8 rounded-lg">
            <div>
                <h3 class="text-4xl font-bold text-green-700">{{ stats?.totalTrabalhos ?? '...' }}</h3>
                <p class="text-gray-600 mt-2">Trabalhos Publicados</p>
            </div>
            <div>
                <h3 class="text-4xl font-bold text-green-700">{{ stats?.totalAutores ?? '...' }}</h3>
                <p class="text-gray-600 mt-2">Autores Cadastrados</p>
            </div>
            <div>
                <h3 class="text-4xl font-bold text-green-700">{{ stats?.totalCursos ?? '...' }}</h3>
                <p class="text-gray-600 mt-2">Comunidades</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SelectItem } from '@nuxt/ui'
import { Zap, Settings, FolderCode } from 'lucide-vue-next'
import type { Component } from 'vue'

const router = useRouter()
const queryPesquisa = ref<string>('')
const opcoesSelecionadas = ref<number[]>([1])

const opcoesPesquisa: SelectItem[] = [
    { label: 'Todos os campos', id: 1 },
    { label: 'Título', id: 2 },
    { label: 'Autores', id: 3 },
    { label: 'Orientadores', id: 4 },
    { label: 'Ano de publicação', id: 5 },
    { label: 'Resumo', id: 6 },
]

const buscar = () => {
    if (queryPesquisa.value.trim()) {
        router.push({
            path: '/pesquisa', // O caminho para sua página de resultados
            query: { q: queryPesquisa.value, campos: opcoesSelecionadas.value }
        })
    }
}

type Pessoa = {
    id: number
    nome: string
    sobrenome: string
}
type TrabalhoPessoa = {
    papel: 'AUTOR' | 'ORIENTADOR'
    pessoa: Pessoa
}
type Curso = {
    id: number
    nome: string
}
type Trabalho = {
    id: number
    titulo: string
    dataDefesa: string
    curso: { nome: string }
    pessoas: TrabalhoPessoa[]
}
type ApiResponse = {
    items: Trabalho[]
    totalItems: number
    page: number
    limit: number
}
interface CursoApiResponse {
    items: Curso[]
    totalItems: number
}
interface TipoDocumental {
    id: number
    nome: string
}
interface FacetaPalavraChave {
    id: number
    nome: string
    _count: { trabalhos: number }
}
interface FacetaAutor {
    id: number
    nome: string
    sobrenome: string // Agora é obrigatório, corrigindo o erro 1
    _count: { trabalhos: number }
}
interface Stats {
    totalTrabalhos: number
    totalAutores: number
    totalCursos: number
}

// Submissões recentes
const { data, pending, error } = useAsyncData(
    'trabalhos-recentes',
    () => $fetch<ApiResponse>(`/api/trabalhos?page=1&limit=5`),
    { default: () => ({ items: [], totalItems: 0, page: 1, limit: 5 }) }
)
const trabalhosRecentes = computed(() => data.value?.items ?? [])

// Comunidades
const iconesCursos: Record<string, Component> = {
    'Desenvolvimento de Sistemas': FolderCode,
    'Eletrotécnica': Zap,
    'Mecânica': Settings
}
const { data: cursosData, pending: pendingCursos, error: errorCursos } = useAsyncData(
    'cursos-home',
    () => $fetch<CursoApiResponse>('/api/cursos'),
    { default: () => ({ items: [], totalItems: 0 }) }
)
const cursosList = computed(() => cursosData.value?.items ?? [])

// Facetas: Tipos documentais
const { data: tiposData } = useAsyncData(
    'facetas-tipos',
    () => $fetch<{ items: TipoDocumental[] }>('/api/tiposdocumentais'),
    { default: () => ({ items: [] }) }
)
const tiposDocumentais = computed(() => tiposData.value?.items ?? [])
// Facetas: Autores populares
const { data: autoresData } = useAsyncData(
    'facetas-autores',
    () => $fetch<FacetaAutor[]>('/api/facetas/autores-populares'),
    { default: () => [] }
)
const autoresPopulares = computed(() => autoresData.value ?? [])
// Facetas: Palavras-chave populares
const { data: palavrasData } = useAsyncData(
    'facetas-palavras',
    () => $fetch<FacetaPalavraChave[]>('/api/facetas/palavras-populares'),
    { default: () => [] }
)
const palavrasChavePopulares = computed(() => palavrasData.value ?? [])

// Indicadores
const { data: stats } = useAsyncData(
    'stats-home',
    () => $fetch<Stats>('/api/stats'),
    { default: () => ({ totalTrabalhos: 0, totalAutores: 0, totalCursos: 0 }) }
)

// Acordeão para as facetas
const accordionItems = [
    { label: 'Tipo Documental', slot: 'tipos', defaultOpen: true },
    { label: 'Autores Populares', slot: 'autores' },
    { label: 'Palavras-Chave Populares', slot: 'palavras' }
]

function formatarAutores(pessoas: TrabalhoPessoa[]): string {
    if (!pessoas || pessoas.length === 0) return 'Autor não informado'
    const nomesFormatados = pessoas
        .filter(p => p.papel === 'AUTOR')
        .map(p => `${p.pessoa.sobrenome.toUpperCase()}, ${p.pessoa.nome}`)
    if (nomesFormatados.length === 0) return 'Autor não informado'
    return nomesFormatados.join('; ')
}
</script>
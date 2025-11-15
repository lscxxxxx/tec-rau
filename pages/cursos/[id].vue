<template>
    <main class="max-w-6xl mx-auto w-full p-6">

        <div v-if="pendingCurso" class="text-center py-10">
            Carregando curso...
        </div>

        <div v-else-if="errorCurso" class="text-center py-10 text-red-500">
            <h1>Erro ao carregar a página</h1>
            <p>{{ errorCurso?.statusMessage }}</p>
        </div>

        <div v-else-if="curso && trabalhosDoCurso">

            <nav class="flex items-center text-sm text-gray-600 mb-4">
                <template v-for="(p, idx) in paginas" :key="idx">
                    <div class="flex items-center">

                        <!-- Link clicável (com ícone opcional) -->
                        <NuxtLink v-if="p.to" :to="p.to"
                            class="flex items-center gap-1 hover:underline hover:text-green-700 transition-colors">
                            <component v-if="p.icon" :is="p.icon" class="w-4 h-4 mr-1 text-green-700" />
                            {{ p.label }}
                        </NuxtLink>

                        <!-- Texto (página atual, sem link) -->
                        <span v-else class="flex items-center gap-1">
                            <component v-if="p.icon" :is="p.icon" class="w-4 h-4 mr-1 text-gray-600" />
                            {{ p.label }}
                        </span>

                        <!-- Divisor -->
                        <ChevronRight v-if="idx < paginas.length - 1" class="mx-2 text-gray-400" />
                    </div>
                </template>
            </nav>

            <h2 class="text-2xl font-semibold mt-10 mb-6">
                Trabalhos de {{ curso.nome }}
            </h2>

            <div class="bg-gray-200 rounded-lg">
                <div class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
                    <UInput size="xl" icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
                    <USelect size="xl" multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
                    <UButton size="xl" color="primary" class="uppercase font-semibold px-6" @click="buscar">Buscar
                    </UButton>
                </div>
            </div>

            <div v-if="pendingTrabalhos" class="text-center py-10">
                Carregando trabalhos...
            </div>

            <div v-else-if="errorTrabalhos" class="text-center py-10 text-red-500">
                <h1>Erro ao carregar os trabalhos</h1>
                <p>{{ errorTrabalhos?.statusMessage }}</p>
            </div>

            <div v-else-if="trabalhosDoCurso.length > 0" class="gap-5 py-5">
                <ul class="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                    <li v-for="trabalho in trabalhosDoCurso" :key="trabalho.id"
                        class="bg-gray-50 p-4 hover:bg-gray-100 transition-colors">

                        <NuxtLink :to="`/trabalho/${trabalho.id}`"
                            class="text-blue-700 text-xl font-medium hover:underline">{{
                                trabalho.titulo }}</NuxtLink>

                        <p class="text-sm text-gray-600 mt-1">
                            {{ formatarAutores(trabalho.pessoas) }}
                            ({{ new Date(trabalho.dataDefesa).getFullYear() }})
                        </p>
                    </li>
                </ul>
            </div>

            <div v-else class="py-10 text-center text-gray-500">
                Nenhum trabalho encontrado para este curso.
            </div>

            <div v-if="totalItems > limit" class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="limit" :total="totalItems" />
            </div>

        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Home, ChevronRight } from 'lucide-vue-next'
import type { SelectItem } from '@nuxt/ui'
import type { NuxtError } from '#app'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

export interface Pagina {
    label: string
    to?: string
    icon?: any
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
type Trabalho = {
    id: number
    titulo: string
    dataDefesa: string
    pessoas: TrabalhoPessoa[]
}
type TrabalhoApiResponse = {
    items: Trabalho[]
    totalItems: number
    page: number
    limit: number
}
type Curso = {
    id: number
    nome: string
}

const page = ref(1)
const limit = ref(10)

const { data: curso, pending: pendingCurso, error: errorCurso } = useAsyncData<Curso, NuxtError>(
    `curso-${id.value}`,
    () => $fetch<Curso>(`/api/cursos/${id.value}`),
    { lazy: true }
)

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

function buscar() {
    if (!queryPesquisa.value.trim()) return;
    router.push({
        path: '/pesquisa',
        query: {
            q: queryPesquisa.value,
            campos: opcoesSelecionadas.value,
            cursoId: id.value
        }
    })
}

const key = computed(() => `trabalhos-curso-${id.value}-p${page.value}`)

const { data: trabalhosData, pending: pendingTrabalhos, error: errorTrabalhos } = useAsyncData<TrabalhoApiResponse, NuxtError>(
    key.value,
    () => $fetch<TrabalhoApiResponse>(
        `/api/trabalhos?cursoId=${id.value}&page=${page.value}&limit=${limit.value}`
    ),
    {
        lazy: true,
        default: () => ({ items: [], totalItems: 0, page: 1, limit: limit.value })
    }
)

const trabalhosDoCurso = computed(() => trabalhosData.value?.items ?? [])
const totalItems = computed(() => trabalhosData.value?.totalItems ?? 0)

function formatarAutores(pessoas: TrabalhoPessoa[]): string {
    if (!pessoas || pessoas.length === 0) return 'Autor não informado'
    const nomesFormatados = pessoas
        .filter(p => p.papel === 'AUTOR')
        .map(p => `${p.pessoa.sobrenome.toUpperCase()}, ${p.pessoa.nome}`)
    if (nomesFormatados.length === 0) return 'Autor não informado'
    return nomesFormatados.join('; ')
}

const paginas = computed<Pagina[]>(() => {
    const crumbs: Pagina[] = [
        { label: 'Página Inicial', to: '/', icon: Home },
        { label: 'Cursos', to: '/cursos' }
    ]
    if (curso.value) {
        crumbs.push({ label: curso.value.nome })
    } else if (pendingCurso.value) {
        crumbs.push({ label: 'Carregando...' })
    }
    return crumbs
})
</script>
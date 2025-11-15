<template>
    <main>
        <h2 class="text-2xl font-semibold mt-10 mb-6">{{ tituloPagina }}</h2>

        <div class="bg-gray-200 rounded-lg">
            <div class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
                <UInput size="xl" icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
                <USelect size="xl" multiple v-model="opcoesSelecionadas" value-key="id" :items="opcoesPesquisa" />
                <UButton size="xl" color="primary" class="uppercase font-semibold px-6" @click="buscar">Buscar
                </UButton>
            </div>
        </div>

        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <div class="text-sm text-gray-600">
                <p v-if="!pending && totalItems > 0">{{ textoResultados }}</p>
            </div>
        </div>

        <div>
            <UTable :data="trabalhos" :columns="columns" :loading="pending"
                class="bg-white shadow-md rounded-md overflow-hidden">
                <template #titulo-cell="{ row }">
                    <NuxtLink :to="`/trabalho/${row.original.id}`" class="text-blue-700 break-words whitespace-normal hover:underline">{{ row.original.titulo }}</NuxtLink>
                </template>
                <template #dataDefesa-cell="{ row }">
                    <span>{{ new Date(row.original.dataDefesa).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                        }}</span>
                </template>
                <template #autores-cell="{ row }">
                    <span class="break-words whitespace-normal">{{ formatarPessoas(row.original.pessoas, 'AUTOR')
                        }}</span>
                </template>
                <template #orientadores-cell="{ row }">
                    <span class="break-words whitespace-normal">{{ formatarPessoas(row.original.pessoas,
                        'ORIENTADOR') }}</span>
                </template>
                <template #loading-state>
                    <div class="flex items-center justify-center h-32">
                        <i class="i-lucide-loader-circle text-4xl animate-spin" />
                    </div>
                </template>
                <template #empty-state>
                    <div class="flex flex-col items-center justify-center py-6 gap-3">
                        <span class="text-sm text-gray-500">Nenhum trabalho encontrado.</span>
                    </div>
                </template>
            </UTable>
        </div>

        <div v-if="totalItems > limit" class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="limit" :total="totalItems" />
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import type { SelectItem, TableColumn } from '@nuxt/ui'

interface Pessoa {
    id: number
    nome: string
    sobrenome: string
}
interface TrabalhoPessoa {
    papel: 'AUTOR' | 'ORIENTADOR'
    pessoa: Pessoa
}
interface Trabalho {
    id: number
    titulo: string
    dataDefesa: string
    pessoas: TrabalhoPessoa[]
}

const columns: TableColumn<Trabalho>[] = [
    { id: 'titulo', header: 'Título' },
    { id: 'dataDefesa', header: 'Data de defesa' },
    { id: 'autores', header: 'Autor(es)' },
    { id: 'orientadores', header: 'Orientador(es)' },
]

const route = useRoute()
const router = useRouter()

const pending = ref(false)
const trabalhos = ref<Trabalho[]>([])
const totalItems = ref(0)
const page = ref(1)
const limit = ref(10)

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

const tituloPagina = computed(() => {
    const query = route.query.q as string
    return query ? `Resultados de busca por "${query}"` : 'Resultados de busca'
})
const textoResultados = computed(() => {
    const de = (page.value - 1) * limit.value + 1
    const ate = Math.min(page.value * limit.value, totalItems.value)
    return `Exibindo ${de} - ${ate} de ${totalItems.value} resultados`
})

function formatarPessoas(pessoas: TrabalhoPessoa[], papel: 'AUTOR' | 'ORIENTADOR'): string {
    if (!pessoas || pessoas.length === 0) { return 'Não informado' }
    const nomesFormatados = pessoas
        .filter(p => p.papel === papel)
        .map(p => `${p.pessoa.sobrenome.toUpperCase()}, ${p.pessoa.nome}`)
    return nomesFormatados.length > 0 ? nomesFormatados.join('; ') : 'Não informado'
}

async function buscar() {
    pending.value = true
    router.push({
        query: {
            q: queryPesquisa.value,
            campos: opcoesSelecionadas.value,
            pagina: page.value,
        },
    })
    const params = new URLSearchParams({
        q: queryPesquisa.value,
        page: page.value.toString(),
        limit: limit.value.toString(),
    })
    opcoesSelecionadas.value.forEach(id => params.append('campos', id.toString()))

    try {
        const data = await $fetch<{ items: Trabalho[], totalItems: number }>(`/api/trabalhos?${params.toString()}`)
        trabalhos.value = data.items
        totalItems.value = data.totalItems
    } catch (error) {
        console.error("Erro ao buscar trabalhos:", error)
        trabalhos.value = []
        totalItems.value = 0
    } finally {
        pending.value = false
    }
}

watch(page, buscar)
onMounted(() => {
    if (route.query.q) {
        // Preenche os campos de busca com os dados da URL
        queryPesquisa.value = route.query.q as string
        const campos = route.query.campos
        if (Array.isArray(campos)) {
            opcoesSelecionadas.value = campos.map(c => Number(c))
        } else if (campos) {
            opcoesSelecionadas.value = [Number(campos)]
        }
        page.value = Number(route.query.pagina) || 1
        // Executa a busca com os dados da URL
        buscar()
    }
})
</script>
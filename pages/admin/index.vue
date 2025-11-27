<template>
    <div class="flex flex-col gap-8">

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <UCard class="border-l-4 border-[#006633]">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Trabalhos</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">
                            <USkeleton v-if="pending" class="h-8 w-10" />
                            <span v-else>{{ stats?.totalTrabalhos ?? 0 }}</span>
                        </p>
                    </div>
                    <div class="bg-green-100 p-3 rounded-full text-[#006633]">
                        <BookMarked class="w-6 h-6" />
                    </div>
                </div>
            </UCard>

            <UCard class="border-l-4 border-blue-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Autores</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">
                            <USkeleton v-if="pending" class="h-8 w-10" />
                            <span v-else>{{ stats?.totalAutores ?? 0 }}</span>
                        </p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Users class="w-6 h-6" />
                    </div>
                </div>
            </UCard>

            <UCard class="border-l-4 border-purple-600">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Cursos Ativos</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">
                            <USkeleton v-if="pending" class="h-8 w-10" />
                            <span v-else>{{ stats?.totalCursos ?? 0 }}</span>
                        </p>
                    </div>
                    <div class="bg-purple-100 p-3 rounded-full text-purple-600">
                        <GraduationCap class="w-6 h-6" />
                    </div>
                </div>
            </UCard>

            <UCard class="border-l-4 border-orange-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Administradores</p>
                        <p class="text-3xl font-bold text-gray-800 mt-1">--</p>
                    </div>
                    <div class="bg-orange-100 p-3 rounded-full text-orange-600">
                        <UserCog class="w-6 h-6" />
                    </div>
                </div>
            </UCard>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-2 space-y-6">
                <UCard>
                    <template #header>
                        <h3 class="font-semibold text-gray-700 uppercase flex items-center gap-2">
                            <PlusCircle class="w-5 h-5 text-[#006633]" /> Cadastros
                        </h3>
                    </template>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UButton to="/admin/trabalhos/novo" block size="xl" color="primary" variant="solid"
                            class="h-24 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                            <FilePlus class="w-8 h-8" />
                            <span class="text-lg font-semibold uppercase">Novo Trabalho</span>
                        </UButton>

                        <UButton to="/admin/admins" block size="xl" color="neutral" variant="solid"
                            class="h-24 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                            <UserPlus class="w-8 h-8" />
                            <span class="text-lg font-semibold uppercase">Novo Admin</span>
                        </UButton>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h3 class="font-semibold text-gray-700 uppercase flex items-center gap-2">
                            <Database class="w-5 h-5 text-gray-500" /> Tabelas Auxiliares
                        </h3>
                    </template>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-gray-50 opacity-75 cursor-not-allowed relative overflow-hidden group">
                            <div class="flex items-center gap-3">
                                <div class="bg-gray-200 p-2 rounded-md text-gray-500">
                                    <GraduationCap class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="font-medium text-gray-700 uppercase">Gerenciar Cursos</p>
                                </div>
                            </div>
                            <UBadge label="Em breve" color="neutral" variant="subtle" size="sm" />
                        </div>

                        <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-gray-50 opacity-75 cursor-not-allowed relative overflow-hidden">
                            <div class="flex items-center gap-3">
                                <div class="bg-gray-200 p-2 rounded-md text-gray-500">
                                    <Files class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="font-medium text-gray-700 uppercase">Tipos Documentais</p>
                                </div>
                            </div>
                            <UBadge label="Em breve" color="neutral" variant="subtle" size="sm" />
                        </div>
                    </div>
                </UCard>
            </div>

            <div class="lg:col-span-1">
                <UCard class="h-full">
                    <template #header>
                        <h3 class="font-semibold text-gray-700 uppercase flex items-center gap-2">
                            <ShieldCheck class="w-5 h-5 text-orange-600" /> Qualidade
                        </h3>
                    </template>
                    
                    <div class="space-y-3">
                        <NuxtLink to="/admin/auditoria"
                            class="flex items-center justify-between p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="bg-orange-100 p-2 rounded-md text-orange-600 group-hover:bg-orange-200 transition-colors">
                                    <History class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800 uppercase group-hover:text-orange-800">Auditoria</p>
                                    <p class="text-xs text-gray-500">Logs de sistema</p>
                                </div>
                            </div>
                            <ChevronRight class="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                        </NuxtLink>

                        <NuxtLink to="/admin/boas-praticas"
                            class="flex items-center justify-between p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors group">
                            <div class="flex items-center gap-3">
                                <div class="bg-green-100 p-2 rounded-md text-green-600 group-hover:bg-green-200 transition-colors">
                                    <BookCheck class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800 uppercase group-hover:text-green-800">Boas Práticas</p>
                                    <p class="text-xs text-gray-500">Manual e regras</p>
                                </div>
                            </div>
                            <ChevronRight class="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                        </NuxtLink>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { BookMarked, Users, UserCog, GraduationCap, PlusCircle, FilePlus, UserPlus, Database, Files, ShieldCheck, History, BookCheck, ChevronRight } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

interface StatsResponse {
    totalTrabalhos: number
    totalAutores: number
    totalCursos: number
}

// Busca os dados da sua API real
const { data: stats, pending } = useFetch<StatsResponse>('/api/stats', {
    lazy: true // Carrega sem bloquear a navegação inicial
})
</script>
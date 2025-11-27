<template>
    <div class="flex flex-col gap-6 max-w-5xl mx-auto">
        
        <div>
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookCheck class="w-8 h-8 text-[#006633]" />
                Manual de Boas Práticas
            </h1>
            <p class="text-gray-500 text-sm mt-1">Guia de padronização para cadastro de trabalhos no repositório.</p>
        </div>

        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mt-2">Ferramentas Essenciais</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <UCard class="hover:ring-2 hover:ring-[#006633]/20 transition-all cursor-default">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="bg-red-100 p-2 rounded-lg text-red-600">
                            <FileCheck class="w-6 h-6" />
                        </div>
                        <h3 class="font-bold text-gray-800">Validação PDF/A</h3>
                    </div>
                </template>
                <p class="text-sm text-gray-600 mb-4 h-14">
                    O sistema aceita preferencialmente arquivos no formato <strong>PDF/A</strong> (Arquivamento), que garante a preservação digital a longo prazo.
                </p>
                <UButton 
                    to="https://www.ilovepdf.com/pt/converter-pdf-para-pdfa" 
                    target="_blank"
                    color="warning" 
                    variant="soft" 
                    block
                    icon="i-heroicons-arrow-top-right-on-square"
                >
                    Acessar Conversor Online
                </UButton>
            </UCard>

            <UCard class="hover:ring-2 hover:ring-[#006633]/20 transition-all cursor-default">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <BookOpen class="w-6 h-6" />
                        </div>
                        <h3 class="font-bold text-gray-800">Referências (ABNT)</h3>
                    </div>
                </template>
                <p class="text-sm text-gray-600 mb-4 h-14">
                    Utilize o <strong>MORE (Mecanismo Online para Referências)</strong> da UFSC para gerar as referências bibliográficas no padrão ABNT correto.
                </p>
                <UButton 
                    to="https://more.ufsc.br/" 
                    target="_blank"
                    color="info" 
                    variant="soft" 
                    block
                    icon="i-heroicons-arrow-top-right-on-square"
                >
                    Acessar MORE UFSC
                </UButton>
            </UCard>
        </div>

        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mt-4">Padronização de Dados</h2>
        
        <UCard>
            <div class="space-y-10">
                
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div class="md:col-span-4">
                        <h3 class="font-bold text-gray-800 flex items-center gap-2">
                            <Type class="w-5 h-5 text-gray-500" /> Títulos
                        </h3>
                        <p class="text-sm text-gray-500 mt-2">
                            Utilize <em>Sentence case</em>: Apenas a primeira letra da frase e nomes próprios em maiúsculo. Não use CAIXA ALTA em tudo.
                        </p>
                    </div>
                    <div class="md:col-span-8 space-y-3">
                        <!-- Exemplo Correto -->
                        <div class="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle class="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div>
                                <p class="text-xs font-bold text-green-700 uppercase">Correto</p>
                                <p class="text-sm text-gray-700">Desenvolvimento de um sistema web para gestão de bibliotecas</p>
                            </div>
                        </div>
                        <!-- Exemplo Incorreto -->
                        <div class="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <XCircle class="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <p class="text-xs font-bold text-red-700 uppercase">Incorreto</p>
                                <p class="text-sm text-gray-700">DESENVOLVIMENTO DE UM SISTEMA WEB PARA GESTÃO DE BIBLIOTECAS</p>
                            </div>
                        </div>
                    </div>
                </div>

                <UDivider />

                <div>
                    <h3 class="font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Users class="w-5 h-5 text-gray-500" /> Regras para Nomes e Sobrenomes
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div class="space-y-2">
                            <h4 class="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-1">Sobrenomes Compostos</h4>
                            <p class="text-xs text-gray-500 text-justify">
                                Se composto por hífen, usar a primeira parte; se for uma expressão adjetivada ou com preposição invariável, usar a expressão toda.
                            </p>
                            
                            <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm space-y-3">
                                <div>
                                    <p class="text-xs font-bold text-gray-500 mb-1">Exemplo: Heitor Villa-Lobos</p>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Nome</span><br>Heitor
                                        </div>
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Sobrenome</span><br><strong>Villa-Lobos</strong>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-gray-500 mb-1">Exemplo: G. Espírito Santo</p>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Nome</span><br>G.
                                        </div>
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Sobrenome</span><br><strong>Espírito Santo</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-6">
                            
                            <!-- Prefixos -->
                            <div class="space-y-2">
                                <h4 class="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-1">Com Prefixos (da, de, do)</h4>
                                <p class="text-xs text-gray-500 text-justify">
                                    Usar o prefixo se ele for parte integrante do sobrenome.
                                </p>
                                <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                                    <p class="text-xs font-bold text-gray-500 mb-1">Exemplo: F. de Paula</p>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Nome</span><br>F.
                                        </div>
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Sobrenome</span><br><strong>de Paula</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <h4 class="font-semibold text-gray-700 text-sm border-b border-gray-100 pb-1">Grau de Parentesco</h4>
                                <p class="text-xs text-gray-500 text-justify">
                                    Deve ser citado junto ao sobrenome (Júnior, Filho, Neto, Sobrinho).
                                </p>
                                <div class="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                                    <p class="text-xs font-bold text-gray-500 mb-1">Exemplo: Durval Lima Júnior</p>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Nome</span><br>Durval
                                        </div>
                                        <div class="bg-white px-2 py-1 rounded border border-green-100">
                                            <span class="text-[10px] text-gray-400 uppercase">Sobrenome</span><br><strong>Lima Júnior</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { BookCheck, FileCheck, BookOpen, CheckCircle, XCircle, Type, Users } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' });
</script>
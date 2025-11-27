<template>
    <div class="min-h-screen bg-gray-50 font-sans">

        <main class="max-w-5xl mx-auto px-6 -mt-10 mb-12">
            <UCard class="shadow-lg">
                <div class="prose max-w-none text-gray-700 space-y-6 p-4">
                    
                    <section>
                        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <Info class="w-6 h-6 text-[#006633]" />
                            O que é o TEC-RAU?
                        </h2>
                        <p>
                            O <strong>TEC-RAU</strong> é o repositório institucional dedicado a armazenar, preservar e disseminar a produção intelectual e acadêmica do Instituto Federal de Santa Catarina (IFSC), especificamente do Câmpus Jaraguá do Sul - Rau.
                        </p>
                        <p>
                            Nossa missão é garantir o acesso aberto ao conhecimento gerado pelos estudantes dos cursos técnicos, aumentando a visibilidade das pesquisas e trabalhos de conclusão de curso (projetos integradores) desenvolvidos por nossos estudantes.
                        </p>
                    </section>

                    <hr class="border-gray-200" />

                    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-3">Objetivos</h3>
                            <ul class="list-disc list-inside space-y-2 marker:text-[#006633]">
                                <li>Reunir a produção científica e técnica em um único local</li>
                                <li>Preservar a memória acadêmica da instituição</li>
                                <li>Facilitar o acesso à informação para a comunidade externa</li>
                                <li>Ampliar o impacto das pesquisas realizadas no campus</li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-3">O que você encontra aqui?</h3>
                            <ul class="list-disc list-inside space-y-2 marker:text-[#006633]">
                                <li>Projetos Integradores</li>
                                <li>Artigos e publicações técnicas</li>
                            </ul>
                        </div>
                    </section>

                    <hr class="border-gray-200" />

                </div>
            </UCard>
        </main>
    </div>
</template>

<script setup lang="ts">
import { Info, MapPin, Mail } from 'lucide-vue-next'
</script>
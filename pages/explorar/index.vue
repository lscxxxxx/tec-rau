<template>
    <div class="bg-gray-200">
        <UFieldGroup size="4xl" class="grid grid-cols-[3fr_1fr_auto] gap-4 p-4 items-center">
            <UInput icon="i-lucide-search" placeholder="Pesquise por..." v-model="queryPesquisa" />
            <USelect v-model="opcaoSelecionada" :options="opcoesPesquisa" />
            <UButton color="primary" class="uppercase" @click="buscar">Buscar
            </UButton>
        </UFieldGroup>
    </div>
</template>

<script>
import { USelect } from '#components';

</script>
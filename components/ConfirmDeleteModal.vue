<script setup lang="ts">
import { boolean } from 'yup';


const emit = defineEmits<{
    (e: 'close', value: boolean): void 
}>()
</script>

<template>
    <UModal @close="emit('close', false)" :title="`Excluir trabalho?`">
        <div class="text-sm text-gray-700">
            Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
        </div>

        <template #footer>
            <div class="flex justify-end gap-2 mt-4">
                <UButton color="neutral" label="Não, mantenha" @click="emit('close', false)"></UButton>
                <UButton color="error" label="Sim, apague" @click="emit('close', true)"></UButton>
            </div>
        </template>
    </UModal>
</template>
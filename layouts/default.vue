<template>
  <div class="flex flex-col min-h-screen bg-gray-50 text-gray-800">
    <!-- Cabeçalho -->
    <AppHeader />

    <!-- Conteúdo principal -->
    <main class="flex-1 max-w-7xl mx-auto w-full p-6">
      <slot />
    </main>

    <!-- Rodapé -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '~/components/Header.vue'
import AppFooter from '~/components/Footer.vue'
</script>

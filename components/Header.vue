<template>
  <header class="bg-green-500 px-6 py-3 flex justify-between items-center">
    <img src="/images/logo-ifsc.png" alt="Logo do Repositório Institucional IFSC Rau" class="h-8" />

    <nav class="flex items-center space-x-6">
      <NuxtLink to="/" class="hover:underline">Início</NuxtLink>
      <NuxtLink to="/sobre" class="hover:underline">Sobre</NuxtLink>
      <NuxtLink 
        to="/login" 
        class="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition"
      >
        Entrar
      </NuxtLink>
    </nav>
  </header>
</template>

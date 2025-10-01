<template>
    <footer>

        <div>
            <h2 class="text-xl font-bold text-green-700">Tec-Rau</h2>
            <p class="text-sm text-gray-600">Repositório institucional do campus Jaraguá do Sul - Rau</p>
        </div>

        <ul class="flex space-x-4">
            <li><a href="#" class="px-3 py-2 rounded-md text-gray-700 font-medium transition
                     hover:text-green-700 hover:bg-white
                     active:bg-green-700 active:text-white">Sobre</a></li>
            <li><a href="#" class="px-3 py-2 rounded-md text-gray-700 font-medium transition
                     hover:text-green-700 hover:bg-white
                     active:bg-green-700 active:text-white">Comunidades e coleções</a></li>
            <li><a href="#" class="px-3 py-2 rounded-md text-gray-700 font-medium transition
                     hover:text-green-700 hover:bg-white
                     active:bg-green-700 active:text-white">Navegar</a></li>
            <li><a href="#" class="px-3 py-2 rounded-md text-gray-700 font-medium transition
                     hover:text-green-700 hover:bg-white
                     active:bg-green-700 active:text-white">Estatísticas</a></li>
        </ul>

        <div class="flex space-x-2">
            <UButton icon="i-simple-icons-facebook" color="neutral" variant="ghost" to="https://facebook.com"
                target="_blank" aria-label="Facebook" />
            <UButton icon="i-simple-icons-instagram" color="neutral" variant="ghost" to="https://instagram.com"
                target="_blank" aria-label="Instagram" />
            <UButton icon="i-simple-icons-x" color="neutral" variant="ghost" to="https://x.com" target="_blank"
                aria-label="X" />
            <UButton icon="i-simple-icons-linkedin" color="neutral" variant="ghost" to="https://linkedin.com"
                target="_blank" aria-label="LinkedIn" />
        </div>

        <p class="text-xs text-gray-500 text-center w-full">
            Tec-Rau © {{ new Date().getFullYear() }} – Todos os direitos reservados
        </p>
    </footer>
</template>
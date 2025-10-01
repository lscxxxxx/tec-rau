<template>
    <footer> <!-- Rodapé -->
        <div class="px-20 pb-5">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="justify-self-start"> <!-- Identificação -->
                    <h2 class="uppercase text-2xl font-bold text-green-700 tracking-wider">Tec-Rau</h2>
                    <p class="uppercase text-[10px] text-gray-600 mt-2">Repositório institucional do campus Jaraguá do
                        Sul - Rau</p>
                </div>

                <div class="justify-self-center"> <!-- Mapa do site -->
                    <h3 class="uppercase text-sm font-bold">Mapa do site</h3>
                    <ul class="flex space-x-4">
                        <li><a href="#" class="px-3 py-2 rounded-md text-gray-500 uppercase text-[13px] font-semibold transition hover:text-green-700 active:text-white">Sobre</a></li>
                        <li><a href="#" class="px-3 py-2 rounded-md text-gray-500 uppercase text-[13px] font-semibold transition hover:text-green-700 active:text-white">Comunidades e coleções</a></li>
                        <li><a href="#" class="px-3 py-2 rounded-md text-gray-500 uppercase text-[13px] font-semibold transition hover:text-green-700 active:text-white">Navegar</a></li>
                        <li><a href="#" class="px-3 py-2 rounded-md text-gray-500 uppercase text-[13px] font-semibold transition hover:text-green-700 active:text-white">Estatísticas</a></li>
                    </ul>
                </div>

                <div class="justify-self-end"> <!-- Redes sociais -->
                    <h3 class="uppercase text-sm font-bold">Redes Sociais</h3>
                    <div class="flex space-x-2">
                        <UButton icon="i-simple-icons-facebook" color="neutral" variant="ghost"
                            to="https://facebook.com" target="_blank" aria-label="Facebook" />
                        <UButton icon="i-simple-icons-instagram" color="neutral" variant="ghost"
                            to="https://instagram.com" target="_blank" aria-label="Instagram" />
                        <UButton icon="i-simple-icons-x" color="neutral" variant="ghost" to="https://x.com"
                            target="_blank" aria-label="X" />
                        <UButton icon="i-simple-icons-linkedin" color="neutral" variant="ghost"
                            to="https://linkedin.com" target="_blank" aria-label="LinkedIn" />
                    </div>
                </div>
            </div>
            <div>
                <p class="uppercase text-[10px] text-gray-500 text-center">
                    TEC-RAU © {{ new Date().getFullYear() }} – Todos os direitos reservados
                </p>
            </div>
        </div>
    </footer>
</template>
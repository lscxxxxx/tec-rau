<template>
    <footer class="bg-gray-200"> <!-- Rodapé -->
        <div class="px-20 pb-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
                <div class="justify-self-start"> <!-- Identificação -->
                    <a href="#"><img src="/logo.png" alt="Logo do site" class="h-10" /></a>
                    <p class="uppercase text-[10px] text-gray-600 mt-2">Repositório institucional do campus Jaraguá do
                        Sul - Rau</p>
                </div>

                <div class="justify-self-end"> <!-- Redes sociais -->

                    <h3 class="uppercase text-sm font-bold mb-3">Redes Sociais</h3>

                    <div class="flex space-x-4 justify-center">
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
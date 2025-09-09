<template>
    <footer class="bg-gray-100 border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <!-- Logo / Nome -->
                <div class="text-gray-600 font-semibold">
                    MeuProjeto © {{ new Date().getFullYear() }}
                </div>

                <!-- Links -->
                <nav class="flex gap-6 text-gray-500 text-sm">
                    <a href="#" class="hover:text-gray-900">Sobre</a>
                    <a href="#" class="hover:text-gray-900">Contato</a>
                    <a href="#" class="hover:text-gray-900">Privacidade</a>
                </nav>
            </div>
        </div>
    </footer>
</template>
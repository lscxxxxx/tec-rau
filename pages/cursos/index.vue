<template>
    <div>
        <div>
            <h2 class="text-2xl font-semibold mt-10 mb-4">Cursos</h2>
        </div>
        <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc magna tellus, vehicula a neque ut, vestibulum posuere enim. Etiam tincidunt porttitor augue, ac elementum mauris placerat at. Pellentesque mollis ut eros non hendrerit. Ut vel rutrum mi. Integer vel auctor magna. Donec sed urna sed nisi mollis euismod ac tincidunt est. Sed ut dolor neque. In volutpat aliquet lobortis. Donec lectus lectus, fringilla sit amet facilisis quis, efficitur nec justo. Nunc feugiat mi nisi, et aliquet sem condimentum at. Curabitur in sem eros. Integer gravida lorem quis erat lobortis, a cursus nunc posuere. Morbi ut lectus eu quam blandit pretium. In ut neque metus. Nulla condimentum tortor nulla, et condimentum velit malesuada in.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
            <a href="#"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <Zap />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Eletrotécnica</h3>
                </div>
            </a>

            <a href="#"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <Settings />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Mecânica</h3>
                </div>
            </a>

            <a href="#"
                class="flex items-center gap-3 bg-[#f7f7f7] border border-[#ddd] rounded-lg p-5 transition duration-200 hover:bg-gray-100 hover:border-gray-400 cursor-pointer">
                <div class="p-3 bg-green-100 rounded-xl flex items-center justify-center">
                    <FolderCode />
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 group-hover:text-green-700">Desenvolvimento de
                        Sistemas
                    </h3>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Zap, Settings, FolderCode } from 'lucide-vue-next'
</script>
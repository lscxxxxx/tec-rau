// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxtjs/google-fonts', '@prisma/nuxt'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'Nuxt',
      htmlAttrs: { lang: 'pt-br', },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },]
    }
  },
  prisma: {
    skipPrompts: true,
    autoSetupPrisma: true
  },
  googleFonts: {
    families: {
      Roboto: true,
      'Josefin+Sans': true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100]
      },
      Inter: '200..700',
      'Crimson Pro': {
        wght: '200..900',
        ital: '200..700',
      }
    }
  },
  runtimeConfig: {
    public: { apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000/api' }
  },
})
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  buildDir: '/tmp/tm-creator-build',

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  app: {
    head: {
      title: 'Translation Memory Creator',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  compatibilityDate: '2024-11-01'
})

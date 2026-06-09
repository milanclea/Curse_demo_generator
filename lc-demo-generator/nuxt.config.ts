export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },

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
    fallback: 'light',
    classSuffix: '',
    disableTransition: true,
  },

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    authUsername: process.env.AUTH_USERNAME || 'demo',
    authPassword: process.env.AUTH_PASSWORD || 'langenscheidt2024',
    authSecret: process.env.AUTH_SECRET || 'lc-demo-secret-change-in-prod',
  },

  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
  },

  app: {
    head: {
      title: 'Language Coach Demo Generator',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  compatibilityDate: '2024-11-01'
})

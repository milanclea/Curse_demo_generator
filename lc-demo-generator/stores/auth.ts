import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    init() {
      if (import.meta.client) {
        this.token = localStorage.getItem('lc-auth-token')
      }
    },

    async login(username: string, password: string) {
      const { token } = await $fetch<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      this.token = token
      if (import.meta.client) {
        localStorage.setItem('lc-auth-token', token)
      }
    },

    logout() {
      this.token = null
      if (import.meta.client) {
        localStorage.removeItem('lc-auth-token')
      }
      navigateTo('/login')
    },
  },
})

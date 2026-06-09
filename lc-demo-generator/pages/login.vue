<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Redirect if already logged in
onMounted(() => {
  auth.init()
  if (auth.isLoggedIn) navigateTo('/generator')
})

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Bitte Benutzername und Passwort eingeben.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.login(username.value, password.value)
    await navigateTo('/generator')
  } catch {
    error.value = 'Ungültige Anmeldedaten. Bitte erneut versuchen.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-[#1e3a5f] px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center gap-3">
        <div class="w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <span class="text-[#1e3a5f] font-bold text-sm">LC</span>
        </div>
        <span class="text-white font-semibold text-lg tracking-tight">Language Coach</span>
        <span class="text-blue-300 text-sm font-normal ml-1">Demo Generator</span>
      </div>
    </header>

    <!-- Login card -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <!-- Icon -->
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-[#1e3a5f]" />
          </div>

          <h1 class="text-xl font-semibold text-gray-900 text-center mb-1">Anmelden</h1>
          <p class="text-sm text-gray-500 text-center mb-6">Nur für Langenscheidt Vertriebsteam</p>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Benutzername</label>
              <UInput
                v-model="username"
                placeholder="Benutzername eingeben"
                size="md"
                :ui="{ rounded: 'rounded-lg' }"
                autocomplete="username"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <UInput
                v-model="password"
                type="password"
                placeholder="Passwort eingeben"
                size="md"
                :ui="{ rounded: 'rounded-lg' }"
                autocomplete="current-password"
              />
            </div>

            <div v-if="error" class="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 flex-shrink-0" />
              {{ error }}
            </div>

            <UButton
              type="submit"
              :loading="loading"
              block
              size="md"
              :ui="{ rounded: 'rounded-lg', color: { blue: { solid: 'bg-[#1e3a5f] hover:bg-[#162d4a] text-white' } } }"
              color="blue"
              variant="solid"
            >
              {{ loading ? 'Wird angemeldet...' : 'Anmelden' }}
            </UButton>
          </form>
        </div>

        <p class="text-center text-xs text-gray-400 mt-6">
          Internes Tool · Langenscheidt GmbH &amp; Co. KG
        </p>
      </div>
    </div>
  </div>
</template>

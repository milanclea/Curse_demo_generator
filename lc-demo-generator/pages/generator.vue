<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useGeneratorStore } from '~/stores/generator'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const generator = useGeneratorStore()

const url = ref('')
const language = ref('Business English')

const languages = [
  'Business English',
  'Business Französisch',
  'Business Spanisch',
  'Business Italienisch',
  'Business Chinesisch (Mandarin)',
  'Business Japanisch',
  'Business Arabisch',
  'Business Portugiesisch',
]

const urlError = ref('')

function validateUrl(val: string): boolean {
  try {
    const u = new URL(val.startsWith('http') ? val : `https://${val}`)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

async function handleGenerate() {
  urlError.value = ''
  const cleanUrl = url.value.trim()
  if (!cleanUrl) {
    urlError.value = 'Bitte eine URL eingeben.'
    return
  }
  const finalUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
  if (!validateUrl(finalUrl)) {
    urlError.value = 'Bitte eine gültige URL eingeben (z.B. https://www.firma.de).'
    return
  }
  await generator.generate(finalUrl, language.value)
}

function handleNewDemo() {
  generator.reset()
  url.value = ''
}

const hasCourses = computed(() => generator.courses.length > 0)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top navigation -->
    <header class="bg-[#1e3a5f] px-6 py-3 shadow-sm sticky top-0 z-10">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white rounded-md flex items-center justify-center flex-shrink-0">
            <span class="text-[#1e3a5f] font-bold text-sm">LC</span>
          </div>
          <div>
            <span class="text-white font-semibold text-base">Language Coach</span>
            <span class="text-blue-300 text-sm font-normal ml-2">Demo Generator</span>
          </div>
        </div>
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-arrow-right-on-rectangle"
          :ui="{ rounded: 'rounded-lg', color: { white: { ghost: 'text-blue-200 hover:text-white hover:bg-white/10' } } }"
          color="white"
          @click="auth.logout()"
        >
          Abmelden
        </UButton>
      </div>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

      <!-- Input section -->
      <div v-if="!hasCourses && !generator.isLoading" class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Personalisierte Demo erstellen</h1>
          <p class="text-gray-500 text-sm">
            Website-URL des Interessenten eingeben — die KI analysiert das Unternehmen und generiert 5 maßgeschneiderte Kursvorlagen im Language-Coach-Format.
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <!-- URL input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Website des Interessenten
            </label>
            <UInput
              v-model="url"
              placeholder="z.B. https://www.muster-ag.de"
              size="lg"
              icon="i-heroicons-globe-alt"
              :ui="{ rounded: 'rounded-xl', icon: { leading: { padding: { lg: 'pl-10' } } } }"
              @keyup.enter="handleGenerate"
            />
            <p v-if="urlError" class="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
              <UIcon name="i-heroicons-exclamation-circle" class="w-3.5 h-3.5" />
              {{ urlError }}
            </p>
          </div>

          <!-- Language selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Zielsprache
            </label>
            <USelectMenu
              v-model="language"
              :options="languages"
              size="lg"
              :ui="{ rounded: 'rounded-xl' }"
            />
          </div>

          <!-- Generate button -->
          <UButton
            block
            size="lg"
            icon="i-heroicons-sparkles"
            :ui="{ rounded: 'rounded-xl', color: { blue: { solid: 'bg-[#1e3a5f] hover:bg-[#162d4a] text-white shadow-sm' } } }"
            color="blue"
            variant="solid"
            @click="handleGenerate"
          >
            5 Kursvorlagen generieren
          </UButton>
        </div>

        <!-- Info cards -->
        <div class="grid grid-cols-3 gap-3 mt-6">
          <div v-for="item in [
            { icon: 'i-heroicons-magnifying-glass', label: 'Website wird automatisch analysiert' },
            { icon: 'i-heroicons-cpu-chip', label: 'KI erkennt Branche & Kommunikationssituationen' },
            { icon: 'i-heroicons-document-text', label: 'Fertige Kursvorlagen im LC-Format' },
          ]" :key="item.label"
            class="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <UIcon :name="item.icon" class="w-5 h-5 text-[#1e3a5f] mx-auto mb-2" />
            <p class="text-xs text-gray-500 leading-tight">{{ item.label }}</p>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="generator.isLoading" class="max-w-lg mx-auto text-center py-16">
        <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-[#1e3a5f] animate-pulse" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mb-2">Demo wird erstellt…</h2>
        <p class="text-sm text-gray-500 mb-6">{{ generator.loadingStep }}</p>

        <!-- Progress bar -->
        <div class="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div
            class="bg-[#1e3a5f] h-1.5 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${generator.loadingProgress}%` }"
          />
        </div>
        <p class="text-xs text-gray-400">{{ generator.loadingProgress }}%</p>
      </div>

      <!-- Error state -->
      <div v-if="generator.error && !generator.isLoading" class="max-w-lg mx-auto text-center py-16">
        <div class="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-rose-500" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mb-1">Fehler beim Generieren</h2>
        <p class="text-sm text-gray-500 mb-6">{{ generator.error }}</p>
        <UButton
          variant="outline"
          :ui="{ rounded: 'rounded-lg' }"
          @click="generator.reset(); url = ''"
        >
          Erneut versuchen
        </UButton>
      </div>

      <!-- Results -->
      <div v-if="hasCourses && !generator.isLoading">
        <!-- Results header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-bold text-gray-900">
                5 Kursvorlagen für
                <span class="text-[#1e3a5f]">{{ generator.companyName }}</span>
              </h2>
              <span v-if="generator.isMock" class="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                <UIcon name="i-heroicons-beaker" class="w-3.5 h-3.5" />
                Vorschau-Daten
              </span>
            </div>
            <p class="text-sm text-gray-500">
              Zielsprache: {{ generator.language }} · Generiert aus {{ generator.url }}
            </p>
            <p v-if="generator.isMock" class="text-xs text-amber-600 mt-0.5">
              Kein API-Schlüssel gesetzt — es werden Beispieldaten angezeigt. ANTHROPIC_API_KEY in .env eintragen für echte Kurse.
            </p>
          </div>
          <UButton
            variant="outline"
            icon="i-heroicons-arrow-path"
            :ui="{ rounded: 'rounded-lg' }"
            @click="handleNewDemo"
          >
            Neue Demo
          </UButton>
        </div>

        <!-- Course cards grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CourseCard
            v-for="(course, index) in generator.courses"
            :key="index"
            :course="course"
            :index="index"
            :language="generator.language"
          />
        </div>
      </div>

    </main>
  </div>
</template>

import { defineStore } from 'pinia'

export interface VocabItem {
  term: string
  translation: string
}

export interface PhraseItem {
  phrase: string
  translation: string
}

export interface CourseTemplate {
  titel: string
  kommunikationssituation: string
  lernziel: string
  vokabular: VocabItem[]
  phrasen: PhraseItem[]
}

interface GeneratorState {
  url: string
  language: string
  isLoading: boolean
  loadingStep: string
  loadingProgress: number
  courses: CourseTemplate[]
  error: string | null
  companyName: string
  isMock: boolean
}

const LOADING_STEPS = [
  { label: 'Website wird geladen…', progress: 15 },
  { label: 'Inhalte werden analysiert…', progress: 35 },
  { label: 'Branche & Produkte werden erkannt…', progress: 55 },
  { label: 'Kursinhalte werden generiert…', progress: 75 },
  { label: 'Kursvorlagen werden aufbereitet…', progress: 90 },
]

export const useGeneratorStore = defineStore('generator', {
  state: (): GeneratorState => ({
    url: '',
    language: 'Business English',
    isLoading: false,
    loadingStep: '',
    loadingProgress: 0,
    courses: [],
    error: null,
    companyName: '',
    isMock: false,
  }),

  actions: {
    async generate(url: string, language: string) {
      this.isLoading = true
      this.error = null
      this.courses = []
      this.loadingProgress = 0

      // Animate loading steps while API call runs
      let stepIndex = 0
      const stepInterval = setInterval(() => {
        if (stepIndex < LOADING_STEPS.length) {
          this.loadingStep = LOADING_STEPS[stepIndex].label
          this.loadingProgress = LOADING_STEPS[stepIndex].progress
          stepIndex++
        }
      }, 1200)

      try {
        const result = await $fetch<{ courses: CourseTemplate[]; companyName: string; isMock?: boolean }>('/api/generate', {
          method: 'POST',
          body: { url, language },
        })
        this.courses = result.courses
        this.companyName = result.companyName || new URL(url).hostname
        this.isMock = result.isMock ?? false
        this.url = url
        this.language = language
        this.loadingProgress = 100
      } catch (err: any) {
        this.error = err.data?.message || 'Ein unerwarteter Fehler ist aufgetreten.'
      } finally {
        clearInterval(stepInterval)
        this.isLoading = false
        this.loadingStep = ''
      }
    },

    reset() {
      this.courses = []
      this.error = null
      this.url = ''
      this.companyName = ''
      this.isMock = false
    },
  },
})

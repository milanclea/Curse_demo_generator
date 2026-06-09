import { defineStore } from 'pinia'

export type WizardStep = 1 | 2 | 3
export type SourceType = 'two-documents' | 'direct-tm' | 'multilingual' | null

export interface WizardState {
  step: WizardStep
  tmName: string
  sourceType: SourceType
  sourceFile: File | null
  targetFile: File | null
  sourceLang: string
  targetLang: string
  uploadProgress: number
  uploadJobId: string | null
  uploading: boolean
  error: string | null
  visitedSteps: WizardStep[]
}

export const useWizardStore = defineStore('wizard', {
  state: (): WizardState => ({
    step: 1,
    tmName: 'New Translation Memory',
    sourceType: null,
    sourceFile: null,
    targetFile: null,
    sourceLang: 'de',
    targetLang: 'en',
    uploadProgress: 0,
    uploadJobId: null,
    uploading: false,
    error: null,
    visitedSteps: [1] as WizardStep[]
  }),

  getters: {
    canGoToStep: (state) => (step: WizardStep) => {
      if (step === 1) return true
      if (step === 2) return state.visitedSteps.includes(2)
      if (step === 3) return state.visitedSteps.includes(3)
      return false
    },
    sourceLangLabel: (state) => {
      const langs: Record<string, string> = {
        de: 'German', en: 'English', fr: 'French', es: 'Spanish',
        it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish',
        ru: 'Russian', ja: 'Japanese', zh: 'Chinese', ko: 'Korean',
        ar: 'Arabic', tr: 'Turkish', sv: 'Swedish', da: 'Danish',
        fi: 'Finnish', nb: 'Norwegian', cs: 'Czech', hu: 'Hungarian'
      }
      return langs[state.sourceLang] || state.sourceLang.toUpperCase()
    },
    targetLangLabel: (state) => {
      const langs: Record<string, string> = {
        de: 'German', en: 'English', fr: 'French', es: 'Spanish',
        it: 'Italian', pt: 'Portuguese', nl: 'Dutch', pl: 'Polish',
        ru: 'Russian', ja: 'Japanese', zh: 'Chinese', ko: 'Korean',
        ar: 'Arabic', tr: 'Turkish', sv: 'Swedish', da: 'Danish',
        fi: 'Finnish', nb: 'Norwegian', cs: 'Czech', hu: 'Hungarian'
      }
      return langs[state.targetLang] || state.targetLang.toUpperCase()
    }
  },

  actions: {
    setStep(step: WizardStep) {
      this.step = step
      if (!this.visitedSteps.includes(step)) this.visitedSteps.push(step)
    },

    setTmName(name: string) {
      this.tmName = name
    },

    setSourceType(type: SourceType) {
      this.sourceType = type
    },

    setSourceFile(file: File | null) {
      this.sourceFile = file
    },

    setTargetFile(file: File | null) {
      this.targetFile = file
    },

    setLanguages(sourceLang: string, targetLang: string) {
      this.sourceLang = sourceLang
      this.targetLang = targetLang
    },

    setError(error: string | null) {
      this.error = error
    },

    async uploadAndAdvance() {
      if (!this.sourceFile || !this.targetFile) return

      this.uploading = true
      this.error = null
      this.uploadProgress = 0

      const interval = setInterval(() => {
        this.uploadProgress = Math.min(this.uploadProgress + 15, 90)
      }, 200)

      try {
        const formData = new FormData()
        formData.append('source', this.sourceFile)
        formData.append('target', this.targetFile)
        formData.append('sourceLang', this.sourceLang)
        formData.append('targetLang', this.targetLang)

        const result = await $fetch('/api/upload', { method: 'POST', body: formData })
        this.uploadProgress = 100
        this.uploadJobId = (result as { jobId: string }).jobId

        clearInterval(interval)
        await new Promise(resolve => setTimeout(resolve, 300))

        this.uploading = false
        this.setStep(2)
      } catch (err: unknown) {
        clearInterval(interval)
        this.uploading = false
        this.uploadProgress = 0
        const error = err as { data?: { message?: string }; message?: string }
        this.error = error?.data?.message || error?.message || 'Upload failed. Please try again.'
      }
    },

    reset() {
      this.step = 1
      this.tmName = 'New Translation Memory'
      this.sourceType = null
      this.sourceFile = null
      this.targetFile = null
      this.sourceLang = 'de'
      this.targetLang = 'en'
      this.uploadProgress = 0
      this.uploadJobId = null
      this.uploading = false
      this.error = null
      this.visitedSteps = [1]
    }
  }
})

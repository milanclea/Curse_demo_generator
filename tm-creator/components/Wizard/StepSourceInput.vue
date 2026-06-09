<script setup lang="ts">
import { useWizardStore } from '~/stores/wizard'
import type { SourceType } from '~/stores/wizard'

const wizard = useWizardStore()

const sourceFileError = ref('')
const targetFileError = ref('')

const sourceTypes: Array<{
  type: SourceType
  badge: string
  title: string
  description: string
  available: boolean
}> = [
  {
    type: 'two-documents',
    badge: '.pdf/.docx / .pptx/.xlsx',
    title: 'Two documents',
    description: 'Upload a document pair — source and target text. System aligns segments automatically.',
    available: true
  },
  {
    type: 'direct-tm',
    badge: '.tmx',
    title: 'Direct TM',
    description: 'Upload an existing .tmx file.',
    available: false
  },
  {
    type: 'multilingual',
    badge: '.pdf/.docx / .pptx/.xlsx',
    title: 'Multilingual file',
    description: 'Multilingual spreadsheet with source and target in side-by-side columns.',
    available: false
  }
]

function selectType(type: SourceType) {
  wizard.setSourceType(type)
}

function setSourceFile(file: File | null) {
  wizard.setSourceFile(file)
  sourceFileError.value = ''
}

function setTargetFile(file: File | null) {
  wizard.setTargetFile(file)
  targetFileError.value = ''
}

const canProceed = computed(() =>
  wizard.sourceType === 'two-documents' &&
  wizard.sourceFile !== null &&
  wizard.targetFile !== null
)

async function handleMatchAndValidate() {
  if (!canProceed.value) return
  await wizard.uploadAndAdvance()
}

const router = useRouter()
function cancel() {
  wizard.reset()
  router.push('/translation-memories')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Error alert -->
    <UAlert
      v-if="wizard.error"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-circle"
      :title="wizard.error"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
      @close="wizard.setError(null)"
    />

    <!-- Source type selection -->
    <div>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Choose your source type</p>
      <div class="grid grid-cols-3 gap-4">
        <SourceTypeCard
          v-for="st in sourceTypes"
          :key="st.type"
          :type="st.type"
          :badge="st.badge"
          :title="st.title"
          :description="st.description"
          :available="st.available"
          :selected="wizard.sourceType === st.type"
          @select="selectType"
        />
      </div>
    </div>

    <!-- Two documents flow -->
    <template v-if="wizard.sourceType === 'two-documents'">
      <!-- Language selection -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="grid grid-cols-[1fr_auto_1fr] items-end gap-4">
          <LanguageSelect
            label="Source language"
            :model-value="wizard.sourceLang"
            @update:model-value="wizard.setLanguages($event, wizard.targetLang)"
          />
          <div class="pb-0.5 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <LanguageSelect
            label="Target language"
            :model-value="wizard.targetLang"
            @update:model-value="wizard.setLanguages(wizard.sourceLang, $event)"
          />
        </div>
      </div>

      <!-- File dropzones -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4">
          <FileDropZone
            label="Source"
            :file="wizard.sourceFile"
            :error="sourceFileError"
            @update:file="setSourceFile"
            @error="sourceFileError = $event"
          />
          <FileDropZone
            label="Target"
            :file="wizard.targetFile"
            :error="targetFileError"
            @update:file="setTargetFile"
            @error="targetFileError = $event"
          />
        </div>
      </div>

      <!-- Upload progress -->
      <div v-if="wizard.uploading" class="space-y-1">
        <UProgress
          :value="wizard.uploadProgress"
          :max="100"
          color="blue"
          size="sm"
        />
        <p class="text-xs text-gray-500 text-right">{{ wizard.uploadProgress }}%</p>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-3 pt-2">
        <UButton
          variant="outline"
          label="Cancel"
          :disabled="wizard.uploading"
          @click="cancel"
        />
        <UButton
          label="Match & Validate →"
          :disabled="!canProceed || wizard.uploading"
          :loading="wizard.uploading"
          class="bg-blue-950 hover:bg-blue-900 text-white"
          @click="handleMatchAndValidate"
        />
      </div>
    </template>
  </div>
</template>

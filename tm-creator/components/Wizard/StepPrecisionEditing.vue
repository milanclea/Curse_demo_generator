<script setup lang="ts">
import { useWizardStore } from '~/stores/wizard'
import { useSegmentsStore } from '~/stores/segments'

const wizard = useWizardStore()
const segments = useSegmentsStore()
const toast = useToast()

onMounted(async () => {
  if (segments.segments.length === 0) {
    await segments.loadSegments()
  }
})

async function acceptAllAi() {
  segments.aiAcceptAllModalOpen = true
}

async function confirmAcceptAll() {
  await segments.applyAllAiSuggestions()
  toast.add({
    title: 'AI suggestions applied',
    description: 'All segment targets have been updated with AI suggestions.',
    color: 'green'
  })
}

async function confirmSpecific() {
  if (segments.selectedErrorCategories.length === 0) return
  await segments.applySpecificAiSuggestions(segments.selectedErrorCategories)
  toast.add({
    title: 'AI corrections applied',
    description: `Applied corrections for: ${segments.selectedErrorCategories.join(', ')}`,
    color: 'green'
  })
}

const ERROR_CATEGORIES = ['Accuracy', 'Mistranslation', 'Fluency', 'Terminology']
</script>

<template>
  <div class="space-y-4">
    <QeSummary />

    <!-- AI actions bar -->
    <div class="flex items-center justify-end gap-2 mb-2">
      <UButton
        variant="outline"
        size="sm"
        icon="i-heroicons-sparkles"
        label="Accept all AI rewrites"
        @click="acceptAllAi"
      />
      <UButton
        variant="outline"
        size="sm"
        icon="i-heroicons-adjustments-horizontal"
        label="Accept specific fixes"
        @click="segments.aiSpecificModalOpen = true"
      />
    </div>

    <SegmentsTable :precision-editing="true" />

    <!-- Footer navigation -->
    <div class="flex items-center pt-4 border-t border-gray-100">
      <UButton
        variant="outline"
        icon="i-heroicons-arrow-left"
        label="Back to Match & Validate"
        @click="wizard.setStep(2)"
      />
    </div>

    <!-- AI drawers -->
    <AiSuggestionDrawer />
    <SegmentDetailsDrawer />

    <!-- Accept All AI Modal -->
    <UModal v-model="segments.aiAcceptAllModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 class="font-semibold text-gray-900">Apply all AI suggestions</h3>
          </div>
        </template>

        <p class="text-sm text-gray-600 py-2">
          Apply AI suggestions to all <strong>{{ segments.segments.length }}</strong> segments?
          This will update all target texts with the AI-improved versions.
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" label="Cancel" @click="segments.aiAcceptAllModalOpen = false" />
            <UButton label="Apply all" class="bg-blue-950 hover:bg-blue-900 text-white" @click="confirmAcceptAll" />
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Accept Specific AI Modal -->
    <UModal v-model="segments.aiSpecificModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <h3 class="font-semibold text-gray-900">Accept specific corrections</h3>
        </template>

        <div class="py-2 space-y-3">
          <p class="text-sm text-gray-600">Select which error categories to fix:</p>
          <div class="space-y-2">
            <UCheckbox
              v-for="cat in ERROR_CATEGORIES"
              :key="cat"
              :label="cat"
              :model-value="segments.selectedErrorCategories.includes(cat)"
              @update:model-value="(v: boolean) => {
                if (v) segments.selectedErrorCategories.push(cat)
                else segments.selectedErrorCategories = segments.selectedErrorCategories.filter(c => c !== cat)
              }"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" label="Cancel" @click="segments.aiSpecificModalOpen = false" />
            <UButton
              label="Apply corrections"
              class="bg-blue-950 hover:bg-blue-900 text-white"
              :disabled="segments.selectedErrorCategories.length === 0"
              @click="confirmSpecific"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

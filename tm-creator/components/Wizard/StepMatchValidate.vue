<script setup lang="ts">
import { useWizardStore } from '~/stores/wizard'
import { useSegmentsStore } from '~/stores/segments'

const wizard = useWizardStore()
const segments = useSegmentsStore()
const toast = useToast()

type Phase = 'loading' | 'preview'
const phase = ref<Phase>('loading')
const alignProgress = ref(0)
const currentSubStep = ref<'processing' | 'matching' | 'scoring'>('processing')

onMounted(async () => {
  // Animate alignment progress
  const tick = setInterval(() => {
    alignProgress.value = Math.min(alignProgress.value + 3, 100)
  }, 60)

  await new Promise(r => setTimeout(r, 800))
  currentSubStep.value = 'matching'
  await new Promise(r => setTimeout(r, 800))
  currentSubStep.value = 'scoring'
  await new Promise(r => setTimeout(r, 600))

  clearInterval(tick)
  alignProgress.value = 100

  await new Promise(r => setTimeout(r, 300))

  // Load segments and move to preview
  await segments.loadSegments()
  phase.value = 'preview'
})

async function goToPrecisionEditing() {
  wizard.setStep(3)
}

function stopProcess() {
  wizard.setStep(1)
  toast.add({ title: 'Process stopped', description: 'Returned to Source Input.', color: 'yellow' })
}
</script>

<template>
  <!-- Loading phase -->
  <div v-if="phase === 'loading'" class="flex flex-col items-center justify-center min-h-[400px] space-y-8">
    <div class="w-full max-w-md space-y-4">
      <h2 class="text-lg font-semibold text-blue-950 text-center">Matching & Validating Segments</h2>

      <div class="space-y-1">
        <UProgress :value="alignProgress" :max="100" color="blue" size="sm" />
        <p class="text-right text-sm text-gray-400">{{ alignProgress }}%</p>
      </div>

      <!-- Sub-steps -->
      <div class="flex items-center justify-center gap-0">
        <!-- Processing documents -->
        <div class="flex flex-col items-center gap-1">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="['processing', 'matching', 'scoring'].indexOf(currentSubStep) >= 0
              ? 'bg-blue-950 text-white'
              : 'bg-gray-200 text-gray-400'"
          >
            <svg v-if="['matching', 'scoring'].includes(currentSubStep)" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="text-xs font-bold">1</span>
          </div>
          <span class="text-xs text-gray-500 text-center w-20">Processing documents</span>
        </div>

        <div class="w-12 h-px mb-5" :class="['matching', 'scoring'].includes(currentSubStep) ? 'bg-blue-950' : 'bg-gray-200'" />

        <!-- Matching segments -->
        <div class="flex flex-col items-center gap-1">
          <div
            class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
            :class="['matching', 'scoring'].includes(currentSubStep)
              ? 'border-blue-950 bg-blue-50'
              : 'border-gray-300 bg-white'"
          >
            <svg v-if="currentSubStep === 'matching'" class="w-4 h-4 text-blue-950 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg v-else-if="currentSubStep === 'scoring'" class="w-4 h-4 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="text-xs text-gray-400">»</span>
          </div>
          <span class="text-xs text-gray-500 text-center w-20">Matching segments</span>
        </div>

        <div class="w-12 h-px mb-5" :class="currentSubStep === 'scoring' ? 'bg-blue-950' : 'bg-gray-200'" />

        <!-- Scoring segments -->
        <div class="flex flex-col items-center gap-1">
          <div
            class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
            :class="currentSubStep === 'scoring'
              ? 'border-blue-950 bg-blue-50'
              : 'border-gray-300 bg-white'"
          >
            <svg v-if="currentSubStep === 'scoring'" class="w-4 h-4 text-blue-950 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span v-else class="text-xs text-gray-400">»</span>
          </div>
          <span class="text-xs text-gray-500 text-center w-20">Scoring segments</span>
        </div>
      </div>
    </div>

    <UButton
      variant="outline"
      label="Stop evaluation process"
      icon="i-heroicons-x-circle"
      :ui="{ rounded: 'rounded-full' }"
      @click="stopProcess"
    />
  </div>

  <!-- Preview phase -->
  <div v-else class="space-y-4">
    <QeSummary />
    <SegmentsTable />

    <!-- Footer navigation -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <UButton
        variant="outline"
        icon="i-heroicons-arrow-left"
        label="Back to Source Input"
        @click="wizard.setStep(1)"
      />
      <UButton
        label="Precision Editing →"
        class="bg-blue-950 hover:bg-blue-900 text-white"
        @click="goToPrecisionEditing"
      />
    </div>
  </div>
</template>

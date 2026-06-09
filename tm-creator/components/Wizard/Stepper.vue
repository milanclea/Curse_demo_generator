<script setup lang="ts">
import { useWizardStore } from '~/stores/wizard'
import type { WizardStep } from '~/stores/wizard'

const wizard = useWizardStore()

const steps = [
  { num: 1 as WizardStep, label: 'Source Input' },
  { num: 2 as WizardStep, label: 'Match & Validate' },
  { num: 3 as WizardStep, label: 'Precision Editing' },
]

function clickStep(step: WizardStep) {
  if (wizard.canGoToStep(step)) {
    wizard.setStep(step)
  }
}
</script>

<template>
  <div class="flex items-center gap-0 border-b border-gray-200 pb-0 mb-0">
    <template v-for="(step, i) in steps" :key="step.num">
      <button
        class="flex items-center gap-2 py-3 pr-4 transition-colors group relative"
        :class="[
          wizard.canGoToStep(step.num as 1|2|3) ? 'cursor-pointer' : 'cursor-default',
        ]"
        @click="clickStep(step.num)"
      >
        <!-- Step circle -->
        <span
          class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors"
          :class="[
            wizard.step === step.num
              ? 'bg-blue-950 text-white'
              : wizard.visitedSteps.includes(step.num)
                ? 'bg-blue-950 text-white'
                : 'bg-gray-200 text-gray-500'
          ]"
        >
          <template v-if="wizard.visitedSteps.includes(step.num) && wizard.step !== step.num">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </template>
          <template v-else>{{ step.num }}</template>
        </span>

        <!-- Step label -->
        <span
          class="text-sm font-medium transition-colors relative"
          :class="wizard.step === step.num ? 'text-gray-900' : 'text-gray-400'"
        >
          {{ step.label }}
          <!-- Active underline -->
          <span
            v-if="wizard.step === step.num"
            class="absolute -bottom-3 left-0 right-0 h-0.5 bg-blue-950 rounded-full"
          />
        </span>
      </button>

      <!-- Arrow separator -->
      <svg
        v-if="i < steps.length - 1"
        class="w-4 h-4 text-gray-300 mx-1 shrink-0"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

import { useWizardStore } from '~/stores/wizard'
import { useSegmentsStore } from '~/stores/segments'

const wizard = useWizardStore()
const segments = useSegmentsStore()
const toast = useToast()

const editingName = ref(false)
const nameInput = ref('')

function startEditName() {
  nameInput.value = wizard.tmName
  editingName.value = true
  nextTick(() => {
    const el = document.getElementById('tm-name-input')
    el?.focus()
  })
}

function commitName() {
  if (nameInput.value.trim()) {
    wizard.setTmName(nameInput.value.trim())
  }
  editingName.value = false
}

function exportTmx() {
  const selected = segments.selectedIds.length > 0
    ? segments.segments.filter(s => segments.selectedIds.includes(s.id))
    : segments.segments.filter(s => s.status === 'confirmed')

  const tmxContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tmx SYSTEM "tmx14.dtd">
<tmx version="1.4">
  <header
    creationtool="TM Creator"
    creationtoolversion="1.0"
    datatype="plaintext"
    segtype="sentence"
    adminlang="en-us"
    srclang="${wizard.sourceLang}"
    o-tmf="TM Creator"
  />
  <body>
${selected.map(s => `    <tu>
      <tuv xml:lang="${s.sourceLang}"><seg>${escapeXml(s.source)}</seg></tuv>
      <tuv xml:lang="${s.targetLang}"><seg>${escapeXml(s.target)}</seg></tuv>
    </tu>`).join('\n')}
  </body>
</tmx>`

  const blob = new Blob([tmxContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${wizard.tmName.replace(/\s+/g, '_')}.tmx`
  a.click()
  URL.revokeObjectURL(url)

  toast.add({
    title: 'Export successful',
    description: `${selected.length} segments exported as .tmx`,
    color: 'green'
  })
}

function escapeXml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
</script>

<template>
  <div class="px-6 py-5 max-w-[1200px] mx-auto">
    <!-- Page header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <template v-if="editingName">
          <input
            id="tm-name-input"
            v-model="nameInput"
            class="text-xl font-semibold text-gray-900 border-b border-blue-950 outline-none bg-transparent"
            @blur="commitName"
            @keydown.enter="commitName"
            @keydown.escape="editingName = false"
          />
        </template>
        <template v-else>
          <h1 class="text-xl font-semibold text-gray-900">{{ wizard.tmName }}</h1>
          <button
            class="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            @click="startEditName"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </template>
      </div>

      <!-- Step 3 actions -->
      <div v-if="wizard.step === 3" class="flex items-center gap-2">
        <UButton
          variant="outline"
          label="Export as .tmx"
          icon="i-heroicons-arrow-down-tray"
          size="sm"
          :ui="{ rounded: 'rounded-md' }"
          @click="exportTmx"
        />
        <AddToTmDialog />
      </div>
    </div>

    <!-- Stepper -->
    <WizardStepper />

    <!-- Step content -->
    <div class="mt-6">
      <WizardStepSourceInput v-if="wizard.step === 1" />
      <WizardStepMatchValidate v-else-if="wizard.step === 2" />
      <WizardStepPrecisionEditing v-else-if="wizard.step === 3" />
    </div>
  </div>
</template>

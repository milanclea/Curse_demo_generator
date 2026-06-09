<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const LANGUAGES = [
  { value: 'de', label: '🇩🇪 German (DE)' },
  { value: 'en', label: '🇬🇧 English (EN)' },
  { value: 'fr', label: '🇫🇷 French (FR)' },
  { value: 'es', label: '🇪🇸 Spanish (ES)' },
  { value: 'it', label: '🇮🇹 Italian (IT)' },
  { value: 'pt', label: '🇵🇹 Portuguese (PT)' },
  { value: 'nl', label: '🇳🇱 Dutch (NL)' },
  { value: 'pl', label: '🇵🇱 Polish (PL)' },
  { value: 'ru', label: '🇷🇺 Russian (RU)' },
  { value: 'ja', label: '🇯🇵 Japanese (JA)' },
  { value: 'zh', label: '🇨🇳 Chinese (ZH)' },
  { value: 'ko', label: '🇰🇷 Korean (KO)' },
  { value: 'ar', label: '🇸🇦 Arabic (AR)' },
  { value: 'tr', label: '🇹🇷 Turkish (TR)' },
  { value: 'sv', label: '🇸🇪 Swedish (SV)' },
]

const selected = computed({
  get: () => LANGUAGES.find(l => l.value === props.modelValue) ?? LANGUAGES[0],
  set: (v: { value: string; label: string }) => emit('update:modelValue', v.value)
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-xs text-gray-500">{{ label }}</label>
    <USelectMenu
      v-model="selected"
      :options="LANGUAGES"
      option-attribute="label"
    >
      <template #label>
        <span class="text-sm text-gray-800">{{ selected.label }}</span>
      </template>
    </USelectMenu>
  </div>
</template>

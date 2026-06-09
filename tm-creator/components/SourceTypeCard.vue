<script setup lang="ts">
import type { SourceType } from '~/stores/wizard'

const props = defineProps<{
  type: SourceType
  selected: boolean
  badge: string
  title: string
  description: string
  available?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', type: SourceType): void
}>()

const toast = useToast()

function handleClick() {
  if (!props.available) {
    toast.add({
      title: 'Coming soon',
      description: `The "${props.title}" source type will be available in a future release.`,
      color: 'yellow',
      timeout: 3000
    })
    return
  }
  emit('select', props.type)
}
</script>

<template>
  <div
    class="relative border rounded-lg p-4 cursor-pointer transition-all select-none"
    :class="[
      selected
        ? 'border-blue-950 shadow-sm bg-white'
        : 'border-gray-200 bg-white hover:border-gray-300',
      !available && 'opacity-75'
    ]"
    @click="handleClick"
  >
    <span class="inline-block text-xs font-medium text-gray-600 bg-gray-100 rounded px-1.5 py-0.5 mb-2">
      {{ badge }}
    </span>
    <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ title }}</h3>
    <p class="text-xs text-gray-500 leading-relaxed">{{ description }}</p>
  </div>
</template>

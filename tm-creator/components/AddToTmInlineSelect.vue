<script setup lang="ts">
import { useSegmentsStore } from '~/stores/segments'

const store = useSegmentsStore()
const toast = useToast()

const EXISTING_TMS = [
  { label: 'Personal TM', value: 'Personal TM' },
  { label: 'Marketing TM', value: 'Marketing TM' },
  { label: 'Legal TM', value: 'Legal TM' },
  { label: 'Tech Docs TM', value: 'Tech Docs TM' },
]

const selected = ref(EXISTING_TMS[0])
const saving = ref(false)

async function addToTm() {
  saving.value = true
  try {
    await $fetch('/api/tm/add', {
      method: 'POST',
      body: {
        segmentIds: store.selectedIds,
        tmName: selected.value.value,
        createNew: false
      }
    })
    toast.add({
      title: 'Segments added',
      description: `${store.selectedIds.length} segment${store.selectedIds.length > 1 ? 's' : ''} added to "${selected.value.value}".`,
      color: 'green',
      timeout: 4000
    })
    store.clearSelection()
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <USelectMenu
      v-model="selected"
      :options="EXISTING_TMS"
      option-attribute="label"
      size="xs"
      :ui="{ width: 'w-36' }"
    >
      <template #label>
        <span class="text-sm">{{ selected.label }}</span>
      </template>
    </USelectMenu>

    <UButton
      label="Add to translation memory"
      size="xs"
      class="bg-blue-950 hover:bg-blue-900 text-white"
      :loading="saving"
      @click="addToTm"
    />
  </div>
</template>

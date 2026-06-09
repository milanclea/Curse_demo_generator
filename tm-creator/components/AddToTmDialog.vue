<script setup lang="ts">
import { useSegmentsStore } from '~/stores/segments'
import { useWizardStore } from '~/stores/wizard'

const store = useSegmentsStore()
const wizard = useWizardStore()
const toast = useToast()

const isOpen = ref(false)
const mode = ref<'existing' | 'new'>('existing')
const newTmName = ref('')
const saving = ref(false)

const EXISTING_TMS = [
  { label: 'Marketing TM (DE→EN)', value: 'Marketing TM' },
  { label: 'Legal TM (DE→EN)', value: 'Legal TM' },
  { label: 'Tech Docs TM (DE→EN)', value: 'Tech Docs TM' },
  { label: 'Personal TM (EN→PL)', value: 'Personal TM' },
]

const selectedTm = ref(EXISTING_TMS[0])

const hasSelection = computed(() => store.selectedIds.length > 0)

const dropdownItems = [
  [{
    label: 'Add to existing TM',
    icon: 'i-heroicons-folder-open',
    click: () => openDialog('existing')
  }],
  [{
    label: 'Create new TM',
    icon: 'i-heroicons-plus-circle',
    click: () => openDialog('new')
  }]
]

function openDialog(m: 'existing' | 'new') {
  mode.value = m
  newTmName.value = wizard.tmName
  isOpen.value = true
}

async function save() {
  const tmName = mode.value === 'new' ? newTmName.value : selectedTm.value.value
  if (!tmName) return

  saving.value = true
  try {
    await $fetch('/api/tm/add', {
      method: 'POST',
      body: {
        segmentIds: store.selectedIds,
        tmName,
        createNew: mode.value === 'new'
      }
    })

    toast.add({
      title: 'Segments added',
      description: `${store.selectedIds.length} segment${store.selectedIds.length > 1 ? 's' : ''} added to "${tmName}".`,
      color: 'green',
      timeout: 4000
    })

    store.clearSelection()
    isOpen.value = false
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <UTooltip
      text="Select at least one segment"
      :prevent="hasSelection"
    >
      <UDropdown :items="dropdownItems" :disabled="!hasSelection">
        <UButton
          label="Save Segments"
          trailing-icon="i-heroicons-chevron-down"
          class="bg-blue-950 hover:bg-blue-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasSelection"
          size="sm"
        />
      </UDropdown>
    </UTooltip>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <h3 class="font-semibold text-gray-900">
            {{ mode === 'existing' ? 'Add to existing Translation Memory' : 'Create new Translation Memory' }}
          </h3>
        </template>

        <div class="py-3 space-y-4">
          <p class="text-sm text-gray-600">
            <span class="font-medium">{{ store.selectedIds.length }}</span> segment{{ store.selectedIds.length > 1 ? 's' : '' }} selected
          </p>

          <template v-if="mode === 'existing'">
            <div class="space-y-1">
              <label class="text-xs text-gray-500">Select Translation Memory</label>
              <USelectMenu
                v-model="selectedTm"
                :options="EXISTING_TMS"
                option-attribute="label"
              >
                <template #label>{{ selectedTm.label }}</template>
              </USelectMenu>
            </div>
          </template>

          <template v-else>
            <div class="space-y-1">
              <label class="text-xs text-gray-500">Translation Memory name</label>
              <UInput v-model="newTmName" placeholder="My Translation Memory" />
            </div>
          </template>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" label="Cancel" @click="isOpen = false" />
            <UButton
              :label="mode === 'existing' ? 'Add to TM' : 'Create & Add'"
              class="bg-blue-950 hover:bg-blue-900 text-white"
              :loading="saving"
              @click="save"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

const mockTMs = [
  { id: 1, name: 'Marketing TM', langPair: 'DE → EN', segments: 1243, updatedAt: '2025-04-18' },
  { id: 2, name: 'Legal TM', langPair: 'DE → EN', segments: 876, updatedAt: '2025-04-15' },
  { id: 3, name: 'Tech Docs TM', langPair: 'DE → EN', segments: 3102, updatedAt: '2025-04-10' },
  { id: 4, name: 'Personal TM', langPair: 'EN → PL', segments: 542, updatedAt: '2025-03-22' },
]

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'langPair', label: 'Language pair' },
  { key: 'segments', label: 'Segments' },
  { key: 'updatedAt', label: 'Last updated' },
  { key: 'actions', label: '' }
]
</script>

<template>
  <div class="px-6 py-6 max-w-5xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold text-gray-900">Translation Memories</h1>
      <UButton
        to="/translation-memories/creator"
        icon="i-heroicons-plus"
        label="New Translation Memory"
        color="blue"
        class="bg-blue-950 hover:bg-blue-900"
      />
    </div>

    <UCard :ui="{ body: { padding: 'p-0' } }">
      <UTable :rows="mockTMs" :columns="columns">
        <template #name-data="{ row }">
          <span class="font-medium text-gray-900">{{ row.name }}</span>
        </template>
        <template #segments-data="{ row }">
          <span class="text-gray-700">{{ row.segments.toLocaleString() }}</span>
        </template>
        <template #actions-data>
          <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal" size="xs" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

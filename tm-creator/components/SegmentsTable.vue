<script setup lang="ts">
import { useSegmentsStore } from '~/stores/segments'
import { useWizardStore } from '~/stores/wizard'

const props = defineProps<{
  precisionEditing?: boolean
}>()

const store = useSegmentsStore()
const wizard = useWizardStore()

const PAGE_SIZE_OPTIONS = [10, 25, 50]

const filterOptions = [
  { label: 'All scores', value: 'all' },
  { label: 'Near perfect (≥75)', value: 'near-perfect' },
  { label: 'Minor (51–74)', value: 'minor' },
  { label: 'Significant (<50)', value: 'significant' },
]

const selectedFilter = computed({
  get: () => filterOptions.find(o => o.value === store.filterScore) || filterOptions[0],
  set: (v) => store.setFilterScore(v.value as any)
})

function scoreClass(score: number) {
  if (score >= 75) return 'score-green'
  if (score >= 51) return 'score-yellow'
  return 'score-red'
}

function toggleAll() {
  store.toggleSelectAll()
}

function toggleRow(id: string) {
  store.toggleSelect(id)
}

const selectedCount = computed(() => store.selectedIds.length)

const tabs = computed(() => [
  { label: `Confirmed Segments (${store.confirmedCount})`, value: 'confirmed' as const },
  { label: 'Review Excluded', value: 'excluded' as const, count: store.excludedCount }
])
</script>

<template>
  <div>
    <!-- Tab + search + filter row -->
    <div class="flex items-center justify-between mb-0 gap-4">
      <div class="flex items-center gap-1 border-b border-gray-200 flex-1">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="flex items-center gap-1.5 px-1 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors mr-4"
          :class="store.activeTab === tab.value
            ? 'border-blue-950 text-blue-950'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
          @click="store.setTab(tab.value)"
        >
          {{ tab.label.split('(')[0].trim() }}
          <template v-if="tab.value === 'confirmed'">({{ store.confirmedCount }})</template>
          <UBadge
            v-if="tab.value === 'excluded'"
            :label="String(store.excludedCount)"
            color="yellow"
            variant="solid"
            size="xs"
          />
        </button>
      </div>

      <div class="flex items-center gap-2 shrink-0 pb-1">
        <UInput
          :model-value="store.search"
          placeholder="Search in document..."
          icon="i-heroicons-magnifying-glass"
          size="sm"
          :ui="{ wrapper: 'w-52' }"
          @update:model-value="store.setSearch($event as string)"
        />

        <USelectMenu
          v-model="selectedFilter"
          :options="filterOptions"
          option-attribute="label"
          size="sm"
        >
          <template #label>
            <svg class="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="text-sm">{{ selectedFilter.label }}</span>
          </template>
        </USelectMenu>
      </div>
    </div>

    <!-- Excluded warning banner -->
    <div v-if="store.activeTab === 'excluded'" class="mt-3 mb-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
      <svg class="w-4 h-4 shrink-0 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Excluded segments will not be saved to your translation memory. Please review your selection before exporting.
    </div>

    <!-- Loading spinner -->
    <div v-if="store.loading" class="flex items-center justify-center py-16">
      <svg class="w-8 h-8 text-blue-950 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Table -->
    <div v-else class="border border-gray-200 rounded-lg overflow-hidden mt-3">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="w-10 px-3 py-3">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-blue-950 focus:ring-blue-900 cursor-pointer"
                :checked="store.allVisibleSelected"
                :indeterminate="store.someVisibleSelected"
                @change="toggleAll"
              />
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-[42%]">
              Source text: {{ wizard.sourceLangLabel }}
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 w-[42%]">
              Target text: {{ wizard.targetLangLabel }}
            </th>
            <th class="px-3 py-3 text-center text-xs font-semibold text-gray-500 w-16">Score</th>
            <th v-if="store.activeTab === 'excluded'" class="px-3 py-3 text-center text-xs font-semibold text-gray-500 w-24">
              Confirm Segment
            </th>
            <th v-if="precisionEditing" class="w-10" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Selection action row (inline, shown when items selected) -->
          <tr v-if="selectedCount > 0 && precisionEditing" class="bg-blue-50 border-b border-blue-100">
            <td colspan="99" class="px-4 py-2.5">
              <div class="flex items-center gap-3 text-sm">
                <span class="text-blue-900 font-medium">{{ selectedCount }} segment{{ selectedCount > 1 ? 's' : '' }} selected</span>
                <span class="text-gray-400">|</span>
                <span class="text-gray-600">Select translation memory:</span>
                <AddToTmInlineSelect />
                <button
                  class="text-gray-400 hover:text-gray-600 ml-auto"
                  @click="store.clearSelection()"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <tr
            v-for="seg in store.paginatedSegments"
            :key="seg.id"
            class="segment-row hover:bg-gray-50 transition-colors"
            :class="store.selectedIds.includes(seg.id) ? 'bg-blue-50/50' : ''"
          >
            <td class="px-3 py-3 align-top">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-blue-950 focus:ring-blue-900 cursor-pointer mt-0.5"
                :checked="store.selectedIds.includes(seg.id)"
                @change="toggleRow(seg.id)"
              />
            </td>

            <td class="px-4 py-3 align-top text-gray-800 leading-relaxed">
              <span v-if="!seg.source" class="text-gray-300 italic border border-dashed border-gray-300 rounded px-2 py-0.5 text-xs">
                No source text detected
              </span>
              <span v-else>{{ seg.source }}</span>
            </td>

            <td class="px-4 py-3 align-top text-gray-800 leading-relaxed">
              <span v-if="!seg.target" class="text-gray-300 italic border border-dashed border-gray-300 rounded px-2 py-0.5 text-xs">
                No target text detected
              </span>
              <template v-else>
                <span v-if="seg.aiApplied" class="inline-flex items-center gap-1">
                  {{ seg.target }}
                  <svg class="w-3.5 h-3.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span v-else>{{ seg.target }}</span>
              </template>
            </td>

            <td class="px-3 py-3 align-top text-center">
              <span
                class="inline-block rounded px-2 py-0.5 text-xs font-semibold"
                :class="scoreClass(seg.score)"
              >
                {{ seg.score }}
              </span>
            </td>

            <!-- Confirm column for excluded tab -->
            <td v-if="store.activeTab === 'excluded'" class="px-3 py-3 align-top text-center">
              <button
                class="p-1.5 rounded-full hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors"
                title="Move to confirmed"
                @click="store.confirmSegment(seg.id)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </td>

            <!-- AI pencil icon for precision editing -->
            <td v-if="precisionEditing" class="px-2 py-3 align-top">
              <button
                class="p-1 rounded hover:bg-gray-100 text-gray-300 hover:text-blue-700 transition-colors"
                title="AI Review"
                @click="store.openAiDrawer(seg.id)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </td>
          </tr>

          <tr v-if="store.paginatedSegments.length === 0">
            <td colspan="99" class="px-4 py-12 text-center text-sm text-gray-400">
              No segments found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer: rows per page + pagination -->
    <div class="flex items-center justify-between mt-3 px-1">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <span>Rows per page:</span>
        <select
          class="border border-gray-200 rounded text-sm px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-900"
          :value="store.pageSize"
          @change="store.setPageSize(Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="n in PAGE_SIZE_OPTIONS" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>

      <UPagination
        :model-value="store.page"
        :page-count="store.pageSize"
        :total="store.visibleSegments.length"
        :max="5"
        size="xs"
        @update:model-value="store.setPage"
      />
    </div>
  </div>
</template>

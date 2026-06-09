<script setup lang="ts">
import { useSegmentsStore } from '~/stores/segments'

const store = useSegmentsStore()

const summary = computed(() => store.summary)
const show = computed(() => store.showBreakdown)
</script>

<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden mb-4">
    <!-- Toggle header -->
    <button
      class="flex items-center justify-between w-full px-4 py-2.5 bg-white hover:bg-gray-50 text-sm text-blue-700 font-medium transition-colors"
      @click="store.toggleBreakdown"
    >
      <span>{{ show ? 'Hide overall error breakdown' : 'Show overall breakdown' }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="show ? '' : '-rotate-180'"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Summary row -->
    <div v-if="show && summary" class="px-4 py-3 bg-white border-t border-gray-100 flex flex-wrap items-center gap-x-8 gap-y-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl font-bold text-gray-900">{{ summary.total }}</span>
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Segments</span>
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">QE Summary</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
        <span class="text-sm text-gray-600">Near perfect (≥75)</span>
        <span class="font-semibold text-gray-900">{{ summary.nearPerfect }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-amber-500 inline-block" />
        <span class="text-sm text-gray-600">Minor errors (51–75)</span>
        <span class="font-semibold text-gray-900">{{ summary.minor }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-rose-500 inline-block" />
        <span class="text-sm text-gray-600">Significant errors (&lt;50)</span>
        <span class="font-semibold text-gray-900">{{ summary.significant }}</span>
      </div>

      <div class="ml-auto flex items-center gap-6">
        <div class="text-sm">
          <span class="font-bold text-gray-900">{{ summary.confirmed }}</span>
          <span class="text-gray-500 ml-1">Kept</span>
        </div>
        <div class="text-sm">
          <span class="font-bold text-gray-900">{{ summary.excluded }}</span>
          <span class="text-gray-500 ml-1">Excluded</span>
        </div>
      </div>
    </div>
  </div>
</template>

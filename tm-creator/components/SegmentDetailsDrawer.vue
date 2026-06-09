<script setup lang="ts">
import { useSegmentsStore } from '~/stores/segments'

const store = useSegmentsStore()

const isOpen = ref(false)
const detailSeg = ref<{ id: string; source: string; target: string; score: number; status: string } | null>(null)

function open(segId: string) {
  const seg = store.segments.find(s => s.id === segId)
  if (seg) {
    detailSeg.value = seg
    isOpen.value = true
  }
}

function close() {
  isOpen.value = false
  detailSeg.value = null
}

function scoreLabel(score: number) {
  if (score >= 75) return 'Near perfect'
  if (score >= 51) return 'Minor errors'
  return 'Significant errors'
}

function scoreClass(score: number) {
  if (score >= 75) return 'score-green'
  if (score >= 51) return 'score-yellow'
  return 'score-red'
}

defineExpose({ open, close })
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/20 z-40" @click="close" />
  </Transition>

  <Transition name="slide-right">
    <div
      v-if="isOpen && detailSeg"
      class="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
    >
      <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h2 class="font-semibold text-gray-900">Segment Details</h2>
        <button class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600" @click="close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quality Score</p>
          <div class="flex items-center gap-2">
            <span class="inline-block rounded px-2.5 py-1 text-sm font-bold" :class="scoreClass(detailSeg.score)">
              {{ detailSeg.score }}
            </span>
            <span class="text-sm text-gray-600">{{ scoreLabel(detailSeg.score) }}</span>
          </div>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</p>
          <p class="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">{{ detailSeg.source || '—' }}</p>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target</p>
          <p class="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">{{ detailSeg.target || '—' }}</p>
        </div>

        <div v-if="detailSeg.score < 75" class="space-y-2">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Specific Errors</p>
          <ul class="space-y-1.5">
            <li
              v-for="err in ['Fluency – Grammar', 'Terminology – Should be &quot;for weeks&quot;']"
              :key="err"
              class="flex items-start gap-2 text-sm text-gray-700"
            >
              <svg class="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ err }}
            </li>
          </ul>
        </div>
      </div>

      <div class="px-4 py-4 border-t border-gray-200 space-y-2">
        <UButton
          v-if="detailSeg.status === 'excluded'"
          label="Accept correction and change text"
          size="sm"
          variant="outline"
          class="w-full"
          @click="store.confirmSegment(detailSeg.id); close()"
        />
        <UButton
          label="AI Review"
          size="sm"
          icon="i-heroicons-sparkles"
          class="w-full bg-blue-950 hover:bg-blue-900 text-white"
          @click="store.openAiDrawer(detailSeg.id); close()"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.25s ease; }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>

<script setup lang="ts">
import { useSegmentsStore } from '~/stores/segments'

const store = useSegmentsStore()

const suggestion = computed(() => store.aiSuggestion)
const seg = computed(() =>
  store.aiDrawerSegmentId
    ? store.segments.find(s => s.id === store.aiDrawerSegmentId)
    : null
)

function computeDiff(original: string, improved: string) {
  if (original === improved) return null

  const origWords = original.split(' ')
  const impWords = improved.split(' ')

  const maxLen = Math.max(origWords.length, impWords.length)
  const parts: Array<{ type: 'same' | 'del' | 'ins'; text: string }> = []

  for (let i = 0; i < maxLen; i++) {
    const orig = origWords[i]
    const imp = impWords[i]
    if (orig === imp) {
      parts.push({ type: 'same', text: orig + ' ' })
    } else {
      if (orig) parts.push({ type: 'del', text: orig + ' ' })
      if (imp) parts.push({ type: 'ins', text: imp + ' ' })
    }
  }

  return parts
}
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="store.aiDrawerOpen"
      class="fixed inset-0 bg-black/20 z-40"
      @click="store.closeAiDrawer"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide-right">
    <div
      v-if="store.aiDrawerOpen"
      class="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 class="font-semibold text-gray-900">AI Suggestion</h2>
          <span class="text-xs text-gray-400">KI-Umschreibung</span>
        </div>
        <button
          class="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          @click="store.closeAiDrawer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <!-- Loading -->
        <div v-if="store.aiSuggestionLoading" class="flex items-center justify-center py-12">
          <svg class="w-8 h-8 text-blue-950 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <template v-else-if="suggestion && seg">
          <!-- Source -->
          <div class="space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source (DE)</p>
            <p class="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 leading-relaxed">{{ seg.source }}</p>
          </div>

          <!-- Original target -->
          <div class="space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original Target (EN)</p>
            <p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{{ suggestion.originalTarget || '—' }}</p>
          </div>

          <!-- Diff view -->
          <div class="space-y-1">
            <p class="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Suggestion
            </p>
            <div class="text-sm bg-blue-50 border border-blue-100 rounded-lg p-3 leading-relaxed">
              <template v-if="computeDiff(suggestion.originalTarget, suggestion.improvedTarget)">
                <span
                  v-for="(part, i) in computeDiff(suggestion.originalTarget, suggestion.improvedTarget)"
                  :key="i"
                  :class="{
                    'diff-del': part.type === 'del',
                    'diff-ins': part.type === 'ins'
                  }"
                >{{ part.text }}</span>
              </template>
              <template v-else>
                {{ suggestion.improvedTarget }}
              </template>
            </div>
          </div>

          <!-- Rationale -->
          <div class="space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rationale</p>
            <p class="text-sm text-gray-600 leading-relaxed">{{ suggestion.rationale }}</p>
          </div>

          <!-- Error categories -->
          <div v-if="suggestion.errorCategories?.length" class="space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Error categories</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge
                v-for="cat in suggestion.errorCategories"
                :key="cat"
                :label="cat"
                color="orange"
                variant="subtle"
                size="sm"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- Footer actions -->
      <div class="px-4 py-4 border-t border-gray-200 flex gap-2">
        <UButton
          variant="outline"
          label="Reject"
          class="flex-1"
          @click="store.closeAiDrawer"
        />
        <UButton
          label="Apply"
          class="flex-1 bg-blue-950 hover:bg-blue-900 text-white"
          :disabled="store.aiSuggestionLoading || !suggestion"
          @click="store.applyAiSuggestion"
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

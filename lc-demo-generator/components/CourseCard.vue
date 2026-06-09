<script setup lang="ts">
import type { CourseTemplate } from '~/stores/generator'

const props = defineProps<{
  course: CourseTemplate
  index: number
  language: string
}>()

const isExpanded = ref(false)

const courseColors = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
]

const badgeColor = courseColors[props.index % courseColors.length]
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">

    <!-- Card header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-start gap-3">
      <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold', badgeColor]">
        {{ index + 1 }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 text-sm leading-tight">{{ course.titel }}</h3>
        <span class="tag-pill mt-1.5 inline-block">{{ language }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="px-5 py-4 space-y-4 flex-1">

      <!-- Kommunikationssituation -->
      <div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Kommunikationssituation</p>
        <p class="text-sm text-gray-700 leading-relaxed">{{ course.kommunikationssituation }}</p>
      </div>

      <!-- Lernziel -->
      <div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Lernziel</p>
        <p class="text-sm text-gray-700 leading-relaxed">{{ course.lernziel }}</p>
      </div>

      <!-- Vokabular -->
      <div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Vokabular</p>
        <div class="space-y-0 rounded-lg border border-gray-100 overflow-hidden">
          <div
            v-for="(item, i) in (isExpanded ? course.vokabular : course.vokabular.slice(0, 5))"
            :key="i"
            class="vocab-row px-3"
          >
            <span class="text-sm font-medium text-[#1e3a5f]">{{ item.term }}</span>
            <span class="text-sm text-gray-500">{{ item.translation }}</span>
          </div>
        </div>
        <button
          v-if="course.vokabular.length > 5"
          class="text-xs text-blue-600 mt-1.5 hover:underline"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Weniger anzeigen' : `+${course.vokabular.length - 5} weitere` }}
        </button>
      </div>

      <!-- Phrasen / Redemittel -->
      <div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Phrasen / Redemittel</p>
        <div class="space-y-0 rounded-lg border border-gray-100 overflow-hidden">
          <div
            v-for="(item, i) in course.phrasen"
            :key="i"
            class="phrase-row px-3"
          >
            <p class="text-sm font-medium text-[#1e3a5f]">{{ item.phrase }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ item.translation }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

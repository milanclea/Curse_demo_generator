<script setup lang="ts">
const route = useRoute()

const isCreator = computed(() => route.path.includes('/creator'))
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <AppSidebar />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top navigation tabs -->
      <div class="bg-white border-b border-gray-200 shrink-0">
        <div class="flex items-center px-6 h-11 gap-6">
          <NuxtLink
            to="/translation-memories"
            class="relative pb-2.5 text-sm font-medium transition-colors"
            :class="!isCreator ? 'text-gray-900 border-b-2 border-blue-950' : 'text-gray-500 hover:text-gray-700'"
          >
            Translation Memories
          </NuxtLink>
          <NuxtLink
            to="/translation-memories/creator"
            class="relative pb-2.5 text-sm font-medium transition-colors"
            :class="isCreator ? 'text-gray-900 border-b-2 border-blue-950' : 'text-gray-500 hover:text-gray-700'"
          >
            Translation Memory Creator
          </NuxtLink>
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1 overflow-auto bg-white">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { icon: 'translate', title: 'Translation Memory Creator', to: '/translation-memories/creator' },
  { icon: 'documents', title: 'Translation Memories', to: '/translation-memories' },
  { icon: 'file', title: 'Documents', to: '#' },
  { icon: 'edit', title: 'Editor', to: '#' },
  { icon: 'glossary', title: 'Glossary', to: '#' },
  { icon: 'settings', title: 'Settings', to: '#' },
]
</script>

<template>
  <aside class="w-[72px] shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-3 z-10">
    <!-- Logo -->
    <div class="mb-4 flex items-center justify-center w-10 h-10">
      <svg viewBox="0 0 40 40" class="w-9 h-9" fill="none">
        <rect width="40" height="40" rx="8" fill="white" />
        <path d="M8 28L16 12L20 22L24 16L28 28" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M22 28L26 20L30 28" stroke="#eab308" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Top icons -->
    <div class="flex flex-col items-center gap-1 mb-auto">
      <button class="sidebar-icon" title="Profile">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke-width="1.8" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
      <button class="sidebar-icon" title="Language">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke-width="1.8" />
          <path d="M3 12h18M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9" stroke-width="1.8" />
        </svg>
      </button>

      <div class="w-8 border-t border-gray-200 my-2" />

      <!-- TM icon (active) -->
      <NuxtLink to="/translation-memories/creator" class="sidebar-icon" :class="{ active: route.path.includes('/translation-memories') }" title="Translation Memories">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12h6M9 16h4M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 4a2 2 0 002 2h2a2 2 0 002-2M9 4a2 2 0 012-2h2a2 2 0 012 2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
      <button class="sidebar-icon" title="Documents">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="sidebar-icon" title="Editor">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="sidebar-icon" title="Glossary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="sidebar-icon" title="AI Review">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="sidebar-icon" title="Reports">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- Logout -->
    <div class="mt-auto">
      <button class="sidebar-icon" title="Log out">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </aside>
</template>

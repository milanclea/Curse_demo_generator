<script setup lang="ts">
const props = defineProps<{
  label: string
  file: File | null
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:file', file: File | null): void
  (e: 'error', msg: string): void
}>()

const ACCEPTED_TYPES = ['.docx', '.txt', '.pdf', '.pptx', '.xlsx']
const ACCEPTED_MIME = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function validate(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ACCEPTED_TYPES.includes(ext) && !ACCEPTED_MIME.includes(file.type)) {
    return `Invalid file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`
  }
  return null
}

function handleFile(file: File) {
  const err = validate(file)
  if (err) {
    emit('error', err)
    return
  }
  emit('update:file', file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function onInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function openFilePicker() {
  fileInput.value?.click()
}

function clearFile() {
  emit('update:file', null)
  if (fileInput.value) fileInput.value.value = ''
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      class="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-colors min-h-[140px] cursor-pointer"
      :class="[
        isDragging ? 'border-blue-900 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300',
        error ? 'border-rose-400 bg-rose-50' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="openFilePicker"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="ACCEPTED_TYPES.join(',')"
        @change="onInputChange"
      />

      <template v-if="!file">
        <!-- File icon -->
        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h4m2-10H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13 3v5h5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="text-sm text-gray-600 text-center">
          Drag &amp; drop <strong>{{ label }}</strong> file here, or
          <span class="text-blue-700 font-medium">browse</span>
        </p>
        <p class="text-xs text-gray-400">Accepted: .docx · .txt · .pdf · .pptx · .xlsx</p>
      </template>

      <template v-else>
        <div class="flex items-center gap-3 w-full">
          <svg class="w-8 h-8 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-400">{{ formatBytes(file.size) }}</p>
          </div>
          <button
            class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            @click.stop="clearFile"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </template>
    </div>

    <p v-if="error" class="text-xs text-rose-600 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

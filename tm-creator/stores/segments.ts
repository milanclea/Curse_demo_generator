import { defineStore } from 'pinia'

export interface Segment {
  id: string
  source: string
  target: string
  sourceLang: string
  targetLang: string
  score: number
  status: 'confirmed' | 'excluded'
  aiApplied?: boolean
}

export interface AiSuggestion {
  segmentId: string
  originalTarget: string
  improvedTarget: string
  rationale: string
  errorCategories: string[]
}

export interface QeSummary {
  total: number
  confirmed: number
  excluded: number
  nearPerfect: number
  minor: number
  significant: number
}

export type FilterScore = 'all' | 'near-perfect' | 'minor' | 'significant'
export type ActiveTab = 'confirmed' | 'excluded'

export const useSegmentsStore = defineStore('segments', {
  state: () => ({
    segments: [] as Segment[],
    selectedIds: [] as string[],
    activeTab: 'confirmed' as ActiveTab,
    page: 1,
    pageSize: 10,
    totalConfirmed: 0,
    totalExcluded: 0,
    search: '',
    filterScore: 'all' as FilterScore,
    loading: false,
    summary: null as QeSummary | null,
    showBreakdown: true,

    aiDrawerOpen: false,
    aiDrawerSegmentId: null as string | null,
    aiSuggestion: null as AiSuggestion | null,
    aiSuggestionLoading: false,

    aiAcceptAllModalOpen: false,
    aiSpecificModalOpen: false,
    selectedErrorCategories: [] as string[]
  }),

  getters: {
    selectedSegments: (state) =>
      state.segments.filter(s => state.selectedIds.includes(s.id)),

    visibleSegments: (state) => {
      let filtered = state.segments.filter(s => s.status === state.activeTab)

      if (state.search) {
        const q = state.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.source.toLowerCase().includes(q) ||
          s.target.toLowerCase().includes(q)
        )
      }

      if (state.filterScore !== 'all') {
        filtered = filtered.filter(s => {
          if (state.filterScore === 'near-perfect') return s.score >= 75
          if (state.filterScore === 'minor') return s.score >= 51 && s.score <= 74
          if (state.filterScore === 'significant') return s.score <= 50
          return true
        })
      }

      return filtered
    },

    paginatedSegments(): Segment[] {
      const start = (this.page - 1) * this.pageSize
      return this.visibleSegments.slice(start, start + this.pageSize)
    },

    totalPages(): number {
      return Math.ceil(this.visibleSegments.length / this.pageSize)
    },

    confirmedCount: (state) =>
      state.segments.filter(s => s.status === 'confirmed').length,

    excludedCount: (state) =>
      state.segments.filter(s => s.status === 'excluded').length,

    allVisibleSelected(): boolean {
      const visible = this.paginatedSegments
      return visible.length > 0 && visible.every(s => this.selectedIds.includes(s.id))
    },

    someVisibleSelected(): boolean {
      const visible = this.paginatedSegments
      return visible.some(s => this.selectedIds.includes(s.id)) && !this.allVisibleSelected
    }
  },

  actions: {
    async loadSegments() {
      this.loading = true
      try {
        const res = await $fetch<{
          items: Segment[]
          total: number
          summary: QeSummary
        }>('/api/segments', {
          query: { page: 1, pageSize: 9999 }
        })
        this.segments = res.items
        this.summary = res.summary
        this.totalConfirmed = res.summary.confirmed
        this.totalExcluded = res.summary.excluded
      } finally {
        this.loading = false
      }
    },

    setTab(tab: ActiveTab) {
      this.activeTab = tab
      this.page = 1
      this.selectedIds = []
    },

    setPage(page: number) {
      this.page = page
    },

    setPageSize(size: number) {
      this.pageSize = size
      this.page = 1
    },

    setSearch(q: string) {
      this.search = q
      this.page = 1
    },

    setFilterScore(f: FilterScore) {
      this.filterScore = f
      this.page = 1
    },

    toggleSelect(id: string) {
      const idx = this.selectedIds.indexOf(id)
      if (idx >= 0) {
        this.selectedIds.splice(idx, 1)
      } else {
        this.selectedIds.push(id)
      }
    },

    selectAll() {
      const ids = this.paginatedSegments.map(s => s.id)
      for (const id of ids) {
        if (!this.selectedIds.includes(id)) this.selectedIds.push(id)
      }
    },

    deselectAll() {
      const ids = new Set(this.paginatedSegments.map(s => s.id))
      this.selectedIds = this.selectedIds.filter(id => !ids.has(id))
    },

    toggleSelectAll() {
      if (this.allVisibleSelected) {
        this.deselectAll()
      } else {
        this.selectAll()
      }
    },

    clearSelection() {
      this.selectedIds = []
    },

    confirmSegment(id: string) {
      const seg = this.segments.find(s => s.id === id)
      if (seg) {
        seg.status = 'confirmed'
        this.selectedIds = this.selectedIds.filter(i => i !== id)
      }
    },

    async openAiDrawer(segmentId: string) {
      this.aiDrawerSegmentId = segmentId
      this.aiDrawerOpen = true
      this.aiSuggestion = null
      this.aiSuggestionLoading = true
      try {
        const res = await $fetch<AiSuggestion>(`/api/segments/${segmentId}/ai-suggestion`)
        this.aiSuggestion = res
      } finally {
        this.aiSuggestionLoading = false
      }
    },

    closeAiDrawer() {
      this.aiDrawerOpen = false
      this.aiDrawerSegmentId = null
      this.aiSuggestion = null
    },

    applyAiSuggestion() {
      if (!this.aiSuggestion) return
      const seg = this.segments.find(s => s.id === this.aiSuggestion!.segmentId)
      if (seg) {
        seg.target = this.aiSuggestion.improvedTarget
        seg.aiApplied = true
      }
      this.closeAiDrawer()
    },

    async applyAllAiSuggestions() {
      const allSegs = this.segments
      for (const seg of allSegs) {
        try {
          const res = await $fetch<AiSuggestion>(`/api/segments/${seg.id}/ai-suggestion`)
          seg.target = res.improvedTarget
          seg.aiApplied = true
        } catch {
          // skip
        }
      }
      this.aiAcceptAllModalOpen = false
    },

    async applySpecificAiSuggestions(categories: string[]) {
      const allSegs = this.segments
      for (const seg of allSegs) {
        try {
          const res = await $fetch<AiSuggestion>(`/api/segments/${seg.id}/ai-suggestion`)
          if (res.errorCategories.some(c => categories.includes(c))) {
            seg.target = res.improvedTarget
            seg.aiApplied = true
          }
        } catch {
          // skip
        }
      }
      this.aiSpecificModalOpen = false
      this.selectedErrorCategories = []
    },

    toggleBreakdown() {
      this.showBreakdown = !this.showBreakdown
    }
  }
})

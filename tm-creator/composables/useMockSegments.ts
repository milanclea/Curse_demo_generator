import type { Segment } from '~/stores/segments'

export function useMockSegments() {
  async function fetchAll(): Promise<Segment[]> {
    const res = await $fetch<{ items: Segment[] }>('/api/segments', {
      query: { page: 1, pageSize: 9999 }
    })
    return res.items
  }

  return { fetchAll }
}

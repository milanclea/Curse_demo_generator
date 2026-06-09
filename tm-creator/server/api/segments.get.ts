import segmentsData from '../../mocks/segments.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 10
  const status = (query.status as string) || 'confirmed'
  const search = ((query.search as string) || '').toLowerCase()
  const filterScore = (query.filterScore as string) || 'all'

  let filtered = segmentsData.filter((s: { status: string }) => s.status === status)

  if (search) {
    filtered = filtered.filter((s: { source: string; target: string }) =>
      s.source.toLowerCase().includes(search) ||
      s.target.toLowerCase().includes(search)
    )
  }

  if (filterScore !== 'all') {
    filtered = filtered.filter((s: { score: number }) => {
      if (filterScore === 'near-perfect') return s.score >= 75
      if (filterScore === 'minor') return s.score >= 51 && s.score <= 74
      if (filterScore === 'significant') return s.score <= 50
      return true
    })
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  const all = segmentsData as Array<{ status: string; score: number }>
  const confirmed = all.filter(s => s.status === 'confirmed').length
  const excluded = all.filter(s => s.status === 'excluded').length
  const nearPerfect = all.filter(s => s.score >= 75).length
  const minor = all.filter(s => s.score >= 51 && s.score <= 74).length
  const significant = all.filter(s => s.score <= 50).length

  return {
    items,
    total,
    page,
    pageSize,
    summary: {
      total: all.length,
      confirmed,
      excluded,
      nearPerfect,
      minor,
      significant
    }
  }
})

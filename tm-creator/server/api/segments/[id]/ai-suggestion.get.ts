import suggestionsData from '../../../../mocks/ai-suggestions.json'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  const suggestions = suggestionsData as Record<string, {
    segmentId: string
    originalTarget: string
    improvedTarget: string
    rationale: string
    errorCategories: string[]
  }>

  const suggestion = suggestions[id as string]

  if (!suggestion) {
    throw createError({ statusCode: 404, statusMessage: 'Suggestion not found' })
  }

  return suggestion
})

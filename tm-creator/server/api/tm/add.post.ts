export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { segmentIds, tmName, createNew } = body

  if (!segmentIds || !Array.isArray(segmentIds) || segmentIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No segments provided' })
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    success: true,
    count: segmentIds.length,
    tmName: tmName || 'New TM',
    createNew: createNew || false,
    message: `${segmentIds.length} segment(s) added to "${tmName}".`
  }
})

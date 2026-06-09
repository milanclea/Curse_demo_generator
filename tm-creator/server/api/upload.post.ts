export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return {
    success: true,
    jobId,
    message: 'Files uploaded and processing started.'
  }
})

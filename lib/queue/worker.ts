import { Queue, Worker } from "bullmq"
import IORedis from "ioredis"
import { generateDraftJob } from "./jobs/generate-draft"

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
})

export const generationQueue = new Queue("speech-generation", { connection })

export function startWorker() {
  const worker = new Worker(
    "speech-generation",
    async (job) => {
      const { projectId, draftId } = job.data

      await generateDraftJob(projectId, draftId, async (stage, percent) => {
        await job.updateProgress(percent)
        await job.log(stage)
      })
    },
    {
      connection,
      concurrency: 2,
    }
  )

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`)
  })

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err)
  })

  return worker
}
import { Queue, Worker } from "bullmq"
import IORedis from "ioredis"
import { generateDraftJob } from "./jobs/generate-draft"

let connection: IORedis | undefined
let generationQueue: Queue | undefined

function getConnection() {
  connection ??= new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  })

  return connection
}

export function getGenerationQueue() {
  generationQueue ??= new Queue("speech-generation", {
    connection: getConnection(),
  })

  return generationQueue
}

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
      connection: getConnection(),
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

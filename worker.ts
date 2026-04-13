import { startWorker } from "./lib/queue/worker"

require("dotenv").config({ path: ".env.local" })

console.log("Starting BullMQ worker...")
const worker = startWorker()

process.on("SIGTERM", async () => {
  console.log("Shutting down worker...")
  await worker.close()
  process.exit(0)
})
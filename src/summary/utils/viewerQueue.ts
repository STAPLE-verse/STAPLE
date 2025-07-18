import { Queue } from "bullmq"
import IORedis from "ioredis"

const connection = new IORedis()

export const viewerQueue = new Queue("viewer-build", { connection })

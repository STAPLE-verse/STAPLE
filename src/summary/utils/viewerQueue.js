const { Queue } = require("bullmq")
const IORedis = require("ioredis")

const connection = new IORedis({
  maxRetriesPerRequest: null,
})

const viewerQueue = new Queue("viewer-build", { connection })

module.exports = { viewerQueue }

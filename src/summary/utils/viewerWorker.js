// @ts-nocheck
const { Worker: QueueWorker } = require("bullmq")
const { viewerQueue } = require("./viewerQueue")
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const archiver = require("archiver")

const viewerAppPath = path.resolve("summary-viewer") // update this!
const buildOutputDir = path.join(process.cwd(), "viewer-builds")

// Start the worker
new QueueWorker(
  "viewer-build",
  async (job) => {
    const { jobId, data } = job.data
    const jobFolder = path.join(buildOutputDir, `viewer_${jobId}`)
    // Ensure the buildOutputDir exists before creating the ZIP file
    fs.mkdirSync(buildOutputDir, { recursive: true })
    const jsonPath = path.resolve(viewerAppPath, "src/data/project_summary.json")
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true })
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))

    console.log(`[ViewerWorker] Starting build for job ${jobId}`)

    // Run your viewer build (replace with your actual script)
    execSync(`npm run build`, {
      cwd: viewerAppPath,
      stdio: "inherit",
      env: {
        ...process.env,
        PROJECT_JSON_PATH: jsonPath,
        OUTPUT_DIR: jobFolder,
      },
    })

    console.log(`[ViewerWorker] Build complete for job ${jobId}`)

    const zipPath = path.join(buildOutputDir, `viewer_${jobId}.zip`)
    const output = fs.createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    archive.pipe(output)
    archive.directory(path.join(viewerAppPath, "docs"), false)
    await archive.finalize()

    console.log(`[ViewerWorker] ZIP created at ${zipPath}`)
  },
  {
    connection: viewerQueue.opts.connection,
  }
)

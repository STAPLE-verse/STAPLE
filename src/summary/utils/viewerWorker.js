// @ts-nocheck
const { Worker: QueueWorker } = require("bullmq")
const { viewerQueue } = require("./viewerQueue")
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const archiver = require("archiver")
const { once } = require("events")

const viewerAppPath = path.resolve("summary-viewer")
const buildOutputDir = path.join(process.cwd(), "viewer-builds")

// Start the worker
new QueueWorker(
  "viewer-build",
  async (job) => {
    const { jobId, data } = job.data
    const jobFolder = path.join(buildOutputDir, `Project_Summary_${jobId}`)
    console.log("[viewer-worker] start", { jobId, viewerAppPath, buildOutputDir, jobFolder })
    // Ensure the buildOutputDir exists before creating the ZIP file
    fs.mkdirSync(buildOutputDir, { recursive: true })
    // Write project_summary.json
    const jsonPath = path.resolve(jobFolder, "project_summary.json")
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true })
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))

    const templateDir = path.join(jobFolder)
    fs.cpSync(viewerAppPath, jobFolder, { recursive: true })

    // Inject data into HTML templates and copy to jobFolder
    const templateFiles = [
      "Home.html",
      "Form_Data.html",
      "Contributors.html",
      "Tasks.html",
      "Events.html",
    ]

    templateFiles.forEach((filename) => {
      const templatePath = path.join(templateDir, filename)
      const content = fs.readFileSync(templatePath, "utf-8")
      const injected = content.replace(
        /const jsonData = __INJECT_JSON__/,
        `const jsonData = ${JSON.stringify(data, null, 2)};`
      )
      fs.writeFileSync(path.join(jobFolder, filename), injected)
    })

    // Zip the jobFolder contents
    const zipPath = path.join(buildOutputDir, `Project_Summary_${jobId}.zip`)
    const output = fs.createWriteStream(zipPath)
    const archive = archiver("zip", { zlib: { level: 9 } })

    // Error handlers to make failures visible to BullMQ
    archive.on("error", (err) => {
      console.error("[viewer-worker] archive error", err)
      throw err
    })
    output.on("error", (err) => {
      console.error("[viewer-worker] output stream error", err)
      throw err
    })

    archive.pipe(output)
    // Trailing slash ensures we add the *contents* of the folder
    archive.directory(jobFolder + "/", false)

    // Finalize and wait for OS to close the file descriptor
    const finalizePromise = archive.finalize()
    await once(output, "close")
    await finalizePromise

    // Sanity log with resulting size
    try {
      const { size } = fs.statSync(zipPath)
      console.log("[viewer-worker] zip done", { jobId, zipPath, size })
    } catch (e) {
      console.warn("[viewer-worker] zip stat failed", { jobId, zipPath, error: e?.message })
    }
  },
  {
    connection: viewerQueue.opts.connection,
  }
)

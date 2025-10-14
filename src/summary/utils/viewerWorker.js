// @ts-nocheck
const { Worker: QueueWorker } = require("bullmq")
const { viewerQueue } = require("./viewerQueue")
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const archiver = require("archiver")

const viewerAppPath = path.resolve("summary-viewer")
const buildOutputDir = path.join(process.cwd(), "viewer-builds")

// Start the worker
new QueueWorker(
  "viewer-build",
  async (job) => {
    const { jobId, data } = job.data
    const jobFolder = path.join(buildOutputDir, `Project_Summary_${jobId}`)
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

    archive.pipe(output)
    archive.directory(jobFolder, false)
    await archive.finalize()

    console.log(`[ViewerWorker] ZIP created at ${zipPath}`)
  },
  {
    connection: viewerQueue.opts.connection,
  }
)

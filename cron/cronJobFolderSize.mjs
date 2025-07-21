import fs from "fs"
import path from "path"

function checkViewerBuildsSize() {
  const zipDir = path.join(process.cwd(), "viewer-builds")
  if (!fs.existsSync(zipDir)) return

  const files = fs.readdirSync(zipDir)
  const now = Date.now()
  let totalSize = 0
  const oldFiles = []

  for (const file of files) {
    if (!file.endsWith(".zip")) continue

    const filePath = path.join(zipDir, file)
    const stats = fs.statSync(filePath)
    totalSize += stats.size

    const ageMs = now - stats.mtimeMs
    if (ageMs > 60 * 60 * 1000) {
      // older than 1 hour
      oldFiles.push(filePath)
    }
  }

  const totalSizeMB = totalSize / (1024 * 1024)
  if (totalSizeMB > 500) {
    for (const file of oldFiles) {
      fs.unlinkSync(file)
    }
    console.log(
      `[${new Date().toISOString()}] Cleared ${
        oldFiles.length
      } file(s) over 1 hour old. Folder was ${totalSizeMB.toFixed(2)} MB.`
    )
  } else {
    console.log(`[${new Date().toISOString()}] Folder size OK: ${totalSizeMB.toFixed(2)} MB.`)
  }
}

checkViewerBuildsSize()

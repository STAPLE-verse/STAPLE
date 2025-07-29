import fs from "fs"
import path from "path"

function cleanUpViewerZips() {
  const zipDir = path.join(process.cwd(), "viewer-builds")
  if (!fs.existsSync(zipDir)) return

  const files = fs.readdirSync(zipDir)
  for (const file of files) {
    if (file.endsWith(".zip")) {
      fs.unlinkSync(path.join(zipDir, file))
    }
  }

  console.log(`[${new Date().toISOString()}] Nightly cleanup: deleted viewer ZIPs.`)
}

cleanUpViewerZips()

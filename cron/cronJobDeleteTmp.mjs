import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function cleanUpViewerZips() {
  const zipDir = path.join(__dirname, "..", "viewer-builds")
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

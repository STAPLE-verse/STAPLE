import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query

  if (!jobId || typeof jobId !== "string") {
    return res.status(400).json({ error: "Missing or invalid jobId" })
  }

  const zipPath = path.join(process.cwd(), "viewer-builds", `viewer_${jobId}.zip`)

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({ error: "ZIP not found or not ready" })
  }

  res.setHeader("Content-Type", "application/zip")
  res.setHeader("Content-Disposition", `attachment; filename=viewer_${jobId}.zip`)
  fs.createReadStream(zipPath).pipe(res)
}

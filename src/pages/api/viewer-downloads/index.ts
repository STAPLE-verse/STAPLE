import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import { api } from "src/blitz-server"
import { isValidJobId, viewerZipPath } from "src/summary/utils/viewerJobId"

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx) => {
  if (!ctx.session.userId) {
    return res.status(401).json({ error: "Sign in required" })
  }

  const { jobId } = req.query

  // The id becomes part of a file name, so only the characters a build id can contain are accepted
  if (!isValidJobId(jobId)) {
    return res.status(400).json({ error: "Missing or invalid jobId" })
  }

  const zipPath = viewerZipPath(jobId)

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({ error: "ZIP not found or not ready" })
  }

  res.setHeader("Content-Type", "application/zip")
  res.setHeader("Content-Disposition", `attachment; filename=Project_Summary_${jobId}.zip`)
  fs.createReadStream(zipPath).pipe(res)
})

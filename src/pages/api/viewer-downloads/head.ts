import fs from "fs"
import { NextApiRequest, NextApiResponse } from "next"
import { api } from "src/blitz-server"
import { isValidJobId, viewerZipPath } from "src/summary/utils/viewerJobId"

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx) => {
  if (req.method !== "HEAD") {
    res.status(405).end("Method Not Allowed")
    return
  }

  if (!ctx.session.userId) {
    res.status(401).end("Sign in required")
    return
  }

  const jobId = req.query.jobId
  if (!isValidJobId(jobId)) {
    res.status(400).end("Missing or invalid jobId")
    return
  }

  const filePath = viewerZipPath(jobId)

  if (fs.existsSync(filePath)) {
    res.status(200).end()
  } else {
    res.status(404).end()
  }
})

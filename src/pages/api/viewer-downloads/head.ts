import fs from "fs"
import path from "path"
import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "HEAD") {
    res.status(405).end("Method Not Allowed")
    return
  }

  const jobId = req.query.jobId as string
  if (!jobId) {
    res.status(400).end("Missing jobId")
    return
  }

  const filePath = path.join(process.cwd(), "viewer-builds", `Project_Summary_${jobId}.zip`)

  if (fs.existsSync(filePath)) {
    res.status(200).end()
  } else {
    res.status(404).end()
  }
}

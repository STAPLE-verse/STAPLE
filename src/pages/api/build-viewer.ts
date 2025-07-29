// /pages/api/build-viewer.ts
import { NextApiRequest, NextApiResponse } from "next"
import { nanoid } from "nanoid"
import { viewerQueue } from "src/summary/utils/viewerQueue"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const data = req.body
    const jobId = nanoid()

    await viewerQueue.add("build", { jobId, data })

    return res.status(202).json({ jobId, message: "Build request queued" })
  } catch (err) {
    console.error("Build request error:", err)
    return res.status(500).json({ error: "Failed to queue build request" })
  }
}

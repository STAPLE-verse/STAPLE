// /pages/api/build-viewer.ts
import { NextApiRequest, NextApiResponse } from "next"
import { nanoid } from "nanoid"
import { viewerQueue } from "src/summary/utils/viewerQueue"
import { api } from "src/blitz-server"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"

export default api(async (req: NextApiRequest, res: NextApiResponse, ctx) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Summaries are built by project managers (the Summary page is theirs), so anyone else is refused
  const userId = ctx.session.userId
  if (!userId) {
    return res.status(401).json({ error: "Sign in required" })
  }
  const access = await getProjectAccess(userId)
  if (access.managerProjectIds.length === 0) {
    return res.status(403).json({ error: "Only project managers can build a summary" })
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
})

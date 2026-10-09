import { beforeEach, describe, expect, test, vi } from "vitest"

// ---- stand-ins: the session, the database, the mailer and the build queue ----
let session: { userId: number | null } = { userId: null }
vi.mock("src/blitz-server", () => ({
  api: (handler: any) => (req: any, res: any) => handler(req, res, { session }),
}))

const sendMail = vi.fn()
vi.mock("../../../integrations/mailer", () => ({ ResendMsg: (...a: unknown[]) => sendMail(...a) }))

const queueAdd = vi.fn()
vi.mock("src/summary/utils/viewerQueue", () => ({
  viewerQueue: { add: (...a: unknown[]) => queueAdd(...a) },
}))

let privileges: Array<{ projectId: number; privilege: string }> = []
let myEmail = "me@example.com"
let invitedEmails: string[] = []
vi.mock("db", () => ({
  default: {
    projectPrivilege: { findMany: async () => privileges },
    user: { findUnique: async () => ({ email: myEmail }) },
    invitation: {
      findFirst: async (args: any) =>
        invitedEmails.includes(String(args.where.email.equals).toLowerCase()) &&
        args.where.projectId.in.length > 0
          ? { id: 1 }
          : null,
    },
  },
  MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
}))

import sendEmail from "src/pages/api/send-email"
import buildViewer from "src/pages/api/build-viewer"
import download from "src/pages/api/viewer-downloads/index"
import downloadHead from "src/pages/api/viewer-downloads/head"
import { isValidJobId, viewerZipPath } from "src/summary/utils/viewerJobId"

// a tiny response that records what the route did
const makeRes = () => {
  const res: any = { statusCode: 200, body: undefined, headers: {} }
  res.status = (code: number) => ((res.statusCode = code), res)
  res.json = (body: unknown) => ((res.body = body), res)
  res.end = (body?: unknown) => ((res.body = body), res)
  res.setHeader = (k: string, v: string) => (res.headers[k] = v)
  return res
}
const call = async (handler: any, req: any) => {
  const res = makeRes()
  await handler(req, res)
  return res
}

const FROM = "STAPLE <app@staplescience.com>"
const mail = (over: any = {}) => ({
  from: FROM,
  to: "me@example.com",
  subject: "s",
  html: "h",
  ...over,
})

describe("POST /api/send-email", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    session = { userId: 7 }
    privileges = [{ projectId: 1, privilege: "PROJECT_MANAGER" }]
    myEmail = "me@example.com"
    invitedEmails = ["new.person@example.com"]
    sendMail.mockResolvedValue({ success: true })
  })

  test("refuses anyone who isn't signed in", async () => {
    session = { userId: null }
    const res = await call(sendEmail, { method: "POST", body: mail() })
    expect(res.statusCode).toBe(401)
    expect(sendMail).not.toHaveBeenCalled()
  })

  test("sends the person's own notices, feedback to the helpdesk, and invitations they sent", async () => {
    for (const to of ["Me@Example.com", "staple.helpdesk@gmail.com", "new.person@example.com"]) {
      const res = await call(sendEmail, { method: "POST", body: mail({ to }) })
      expect(res.statusCode, to).toBe(200)
    }
    expect(sendMail).toHaveBeenCalledTimes(3)
  })

  test("refuses mail to anyone else, from another sender, or to several people at once", async () => {
    for (const body of [
      mail({ to: "victim@example.com" }),
      mail({ from: "Your Bank <security@staplescience.com>" }),
      mail({ to: ["me@example.com", "victim@example.com"] }),
      mail({ to: undefined }),
      null,
    ]) {
      const res = await call(sendEmail, { method: "POST", body })
      expect(res.statusCode).toBe(403)
    }
    expect(sendMail).not.toHaveBeenCalled()
  })

  test("an invitation address only works for someone who manages the project", async () => {
    privileges = [{ projectId: 1, privilege: "CONTRIBUTOR" }]
    const res = await call(sendEmail, {
      method: "POST",
      body: mail({ to: "new.person@example.com" }),
    })
    // contributors manage nothing, so the invitation lookup is empty and the mail is refused
    expect(res.statusCode).toBe(403)
  })
})

describe("POST /api/build-viewer", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    session = { userId: 7 }
    privileges = [{ projectId: 1, privilege: "PROJECT_MANAGER" }]
  })

  test("needs a signed-in project manager", async () => {
    session = { userId: null }
    expect((await call(buildViewer, { method: "POST", body: {} })).statusCode).toBe(401)

    session = { userId: 7 }
    privileges = [{ projectId: 1, privilege: "CONTRIBUTOR" }]
    expect((await call(buildViewer, { method: "POST", body: {} })).statusCode).toBe(403)
    expect(queueAdd).not.toHaveBeenCalled()
  })

  test("queues a build for a project manager", async () => {
    const res = await call(buildViewer, { method: "POST", body: { name: "x" } })
    expect(res.statusCode).toBe(202)
    expect(queueAdd).toHaveBeenCalledOnce()
  })
})

describe("viewer downloads", () => {
  beforeEach(() => {
    session = { userId: 7 }
  })

  test("need a signed-in user", async () => {
    session = { userId: null }
    expect((await call(download, { method: "GET", query: { jobId: "abc123" } })).statusCode).toBe(
      401
    )
    expect(
      (await call(downloadHead, { method: "HEAD", query: { jobId: "abc123" } })).statusCode
    ).toBe(401)
  })

  test("refuse a job id that tries to leave the builds folder", async () => {
    for (const jobId of ["../../etc/passwd", "../x", "a/b", "a.b", "", "x".repeat(65)]) {
      expect((await call(download, { method: "GET", query: { jobId } })).statusCode, jobId).toBe(
        400
      )
      expect(
        (await call(downloadHead, { method: "HEAD", query: { jobId } })).statusCode,
        jobId
      ).toBe(400)
    }
  })

  test("accept the ids the build creates", async () => {
    expect(isValidJobId("V1StGXR8_Z5jdHi6B-myT")).toBe(true)
    expect(isValidJobId("../x")).toBe(false)
    expect(viewerZipPath("V1StGXR8_Z5jdHi6B-myT")).toMatch(
      /viewer-builds\/Project_Summary_V1StGXR8_Z5jdHi6B-myT\.zip$/
    )
  })
})

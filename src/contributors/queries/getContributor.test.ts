import { beforeEach, describe, expect, test, vi } from "vitest"

const privileges = vi.fn()
const memberFindFirst = vi.fn()
vi.mock("db", () => ({
  default: {
    projectPrivilege: { findMany: (...args: unknown[]) => privileges(...args) },
    projectMember: { findFirst: (...args: unknown[]) => memberFindFirst(...args) },
  },
  MemberPrivileges: { PROJECT_MANAGER: "PROJECT_MANAGER", CONTRIBUTOR: "CONTRIBUTOR" },
}))

import getContributor from "./getContributor"

const ME = 7
const ctx: any = { session: { userId: ME, $isAuthorized: () => true, $authorize: () => undefined } }
const person = (userId: number) => ({ id: 41, projectId: 3, users: [{ id: userId }] })

describe("getContributor", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("someone outside the project can't look anyone up in it", async () => {
    privileges.mockResolvedValue([{ projectId: 99, privilege: "PROJECT_MANAGER" }])
    await expect(getContributor({ contributorId: 41, projectId: 3 }, ctx)).rejects.toThrow(
      "Contributor not found"
    )
    expect(memberFindFirst).not.toHaveBeenCalled()
  })

  test("the lookup is limited to the project in the request", async () => {
    privileges.mockResolvedValue([{ projectId: 3, privilege: "PROJECT_MANAGER" }])
    memberFindFirst.mockResolvedValue(person(55))
    await getContributor({ contributorId: 41, projectId: 3 }, ctx)
    expect(memberFindFirst.mock.calls[0]![0].where).toEqual({ id: 41, projectId: 3, name: null })
  })

  test("a contributor who isn't in that project is not found", async () => {
    privileges.mockResolvedValue([{ projectId: 3, privilege: "PROJECT_MANAGER" }])
    memberFindFirst.mockResolvedValue(null)
    await expect(getContributor({ contributorId: 41, projectId: 3 }, ctx)).rejects.toThrow(
      "Contributor not found"
    )
  })

  test("project managers can open anyone in their project", async () => {
    privileges.mockResolvedValue([{ projectId: 3, privilege: "PROJECT_MANAGER" }])
    memberFindFirst.mockResolvedValue(person(55))
    await expect(getContributor({ contributorId: 41, projectId: 3 }, ctx)).resolves.toMatchObject({
      id: 41,
    })
  })

  test("a contributor can open their own page", async () => {
    privileges.mockResolvedValue([{ projectId: 3, privilege: "CONTRIBUTOR" }])
    memberFindFirst.mockResolvedValue(person(ME))
    await expect(getContributor({ contributorId: 41, projectId: 3 }, ctx)).resolves.toMatchObject({
      id: 41,
    })
  })

  test("a contributor can open a teammate's page", async () => {
    privileges.mockResolvedValue([{ projectId: 3, privilege: "CONTRIBUTOR" }])
    memberFindFirst.mockResolvedValueOnce(person(55)).mockResolvedValueOnce({ id: 8 }) // a shared team
    await expect(getContributor({ contributorId: 41, projectId: 3 }, ctx)).resolves.toMatchObject({
      id: 41,
    })
  })

  test("a contributor can't open someone they share no team with", async () => {
    privileges.mockResolvedValue([{ projectId: 3, privilege: "CONTRIBUTOR" }])
    memberFindFirst.mockResolvedValueOnce(person(55)).mockResolvedValueOnce(null)
    await expect(getContributor({ contributorId: 41, projectId: 3 }, ctx)).rejects.toThrow(
      "Contributor not found"
    )
  })
})

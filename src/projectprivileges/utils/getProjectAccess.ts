import db, { MemberPrivileges } from "db"

export type ProjectAccess = {
  /** Every project the user belongs to, in any role. */
  memberProjectIds: number[]
  /** The projects where the user is a project manager. */
  managerProjectIds: number[]
}

// What the signed-in user may reach on the server. Queries that take a filter from the
// browser use this to stay inside the user's own projects, since the browser can't be trusted
// to ask only for what it is allowed to see.
export async function getProjectAccess(userId: number): Promise<ProjectAccess> {
  const privileges = await db.projectPrivilege.findMany({
    where: { userId },
    select: { projectId: true, privilege: true },
  })
  return {
    memberProjectIds: privileges.map((row) => row.projectId),
    managerProjectIds: privileges
      .filter((row) => row.privilege === MemberPrivileges.PROJECT_MANAGER)
      .map((row) => row.projectId),
  }
}

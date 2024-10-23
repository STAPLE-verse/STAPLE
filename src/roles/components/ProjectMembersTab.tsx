import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import { useParam } from "@blitzjs/next"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { AllProjectMemberRolesList } from "./AllProjectMemberRolesList"

const ProjectMembersTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ projectMembers }, { refetch }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
      },
      name: { equals: null }, // Ensures the name in ProjectMember is null
    },
    include: { users: true, roles: true },
    orderBy: { id: "asc" },
  })

  const reloadTable = async () => {
    await refetch()
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AllProjectMemberRolesList
            projectMembers={projectMembers}
            onChange={reloadTable}
            projectId={projectId}
          />
        </Suspense>
      </div>
    </main>
  )
}

export default ProjectMembersTab

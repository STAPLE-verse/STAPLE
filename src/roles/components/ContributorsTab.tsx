import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import { useParam } from "@blitzjs/next"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { MultiSelectProvider } from "../../core/components/fields/MultiSelectContext"
import { RoleContributorTable } from "./RoleContributorTable"
import { AddRoleModal } from "./AddRoleModal"
import { useSanitizedProjectMembers } from "src/projectmembers/hooks/useSanitizedProjectMembers"
import { ProjectMemberWithUsersAndRoles } from "src/core/types"

const ContributorsTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ projectMembers: fetchedContributors }, { refetch }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
      },
      name: { equals: null }, // Ensures ProjectMember is contributor and not team
      // deleted: { equals: false }, // Ensures contributor is not deleted
    },
    include: { users: true, roles: true },
    orderBy: { id: "asc" },
  }) as unknown as [{ projectMembers: ProjectMemberWithUsersAndRoles[] }, any]

  const contributors =
    useSanitizedProjectMembers<ProjectMemberWithUsersAndRoles>(fetchedContributors)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <MultiSelectProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RoleContributorTable contributors={contributors} />
          <div className="modal-action flex justify-end mt-4">
            <AddRoleModal
              rows={contributors}
              refetch={refetch}
              projectId={projectId}
              type={"contributor"}
            />
          </div>
        </Suspense>
      </MultiSelectProvider>
    </main>
  )
}

export default ContributorsTab

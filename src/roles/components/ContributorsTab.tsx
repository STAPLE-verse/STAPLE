import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import { useParam } from "@blitzjs/next"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { MultiSelectProvider } from "../../core/components/fields/MultiSelectContext"
import { RoleContributorTable } from "./RoleContributorTable"
import { AddRoleModal } from "./AddRoleModal"
import { ProjectMemberWithUsersAndRoles } from "src/core/types"
import Card from "src/core/components/Card"

const ContributorsTab = () => {
  const projectId = useParam("projectId", "number")

  const [{ projectMembers: contributors }, { refetch }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
      },
      deleted: undefined,
      name: { equals: null }, // Ensures ProjectMember is contributor and not team
    },
    include: { users: true, roles: true },
    orderBy: { id: "asc" },
  }) as unknown as [{ projectMembers: ProjectMemberWithUsersAndRoles[] }, any]

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Card title="">
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
      </Card>
    </main>
  )
}

export default ContributorsTab

import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import { useParam } from "@blitzjs/next"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { MultiSelectProvider } from "../../core/components/fields/MultiSelectContext"
import { RoleContributorTable } from "./RoleContributorTable"
import { AddRoleModal } from "./AddRoleModal"

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
      name: { equals: null }, // Ensures ProjectMember is contributor and not team
    },
    include: { users: true, roles: true },
    orderBy: { id: "asc" },
  })

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

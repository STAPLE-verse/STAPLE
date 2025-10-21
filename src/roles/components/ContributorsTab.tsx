import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import React from "react"
import { Routes, useParam } from "@blitzjs/next"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import { MultiSelectProvider } from "../../core/components/fields/MultiSelectContext"
import { RoleContributorTable } from "./RoleContributorTable"
import { AddRoleModal } from "./AddRoleModal"
import { ProjectMemberWithUsersAndRoles } from "src/core/types"
import Link from "next/link"
import { Tooltip } from "react-tooltip"

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
    <main className="flex flex-col mx-auto w-full">
      <MultiSelectProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
            <RoleContributorTable contributors={contributors} />
            <div className="modal-action flex justify-between mt-4">
              <Link
                href={Routes.RoleBuilderPage()}
                className="btn btn-secondary"
                data-tooltip-id="roles-overview"
              >
                Go to Create Roles
              </Link>
              <Tooltip
                id="roles-overview"
                content="Set up project roles on the Roles page so you can assign them on this page. You can add or edit roles later."
                className="z-[1099] ourtooltips"
              />
              <AddRoleModal
                rows={contributors}
                refetch={refetch}
                projectId={projectId}
                type={"contributor"}
              />
            </div>
          </div>
        </Suspense>
      </MultiSelectProvider>
    </main>
  )
}

export default ContributorsTab

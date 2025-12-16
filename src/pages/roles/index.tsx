import { Suspense, useMemo, useState } from "react"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getRoles from "src/roles/queries/getRoles"
import { AllRolesList } from "src/roles/components/AllRolesList"
import { NewRole } from "src/roles/components/NewRole"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"
import { DefaultRoles } from "src/roles/components/DefaultRoles"
import { PaginationState } from "@tanstack/react-table"

const RoleBuilderPage = () => {
  const currentUser = useCurrentUser()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const paginationArgs = useMemo(
    () => ({
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    }),
    [pagination]
  )

  const [{ roles, count }, { refetch: refetchPagedRoles }] = usePaginatedQuery(getRoles, {
    where: { user: { id: currentUser?.id } },
    orderBy: { id: "asc" },
    ...paginationArgs,
  })

  const [{ roles: allRoles }, { refetch: refetchAllRoles }] = useQuery(getRoles, {
    where: { user: { id: currentUser?.id } },
    orderBy: { id: "asc" },
  })

  const taxonomyList = useMemo(
    () =>
      Array.from(
        new Set(
          allRoles.map((role) => (role.taxonomy || "").trim()).filter((taxonomy) => taxonomy !== "")
        )
      ),
    [allRoles]
  )

  const handleRolesChanged = async () => {
    await Promise.all([refetchPagedRoles(), refetchAllRoles()])
  }

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / pagination.pageSize))

  const handlePaginationChange = (
    updater: PaginationState | ((state: PaginationState) => PaginationState)
  ) => {
    setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Contribution Roles">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center text-3xl items-center">
          Roles{" "}
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="dashboard-overview"
          />
          <Tooltip
            id="dashboard-overview"
            content="Roles describe what each person did in a project—like data collection or project management. You can create your own roles and use them across any project."
            className="z-[1099] ourtooltips"
          />
        </h1>

        <div className="flex justify-center mt-4 mb-2 gap-2">
          <NewRole taxonomyList={taxonomyList} onRolesChanged={handleRolesChanged} />
          <DefaultRoles onRolesChanged={handleRolesChanged} />
        </div>
        <Card title={""}>
          <Suspense fallback={<div>Loading...</div>}>
            <AllRolesList
              roles={roles}
              onRolesChanged={handleRolesChanged}
              taxonomyList={taxonomyList}
              manualPagination={true}
              paginationState={pagination}
              onPaginationChange={handlePaginationChange}
              pageCount={pageCount}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </Suspense>
        </Card>
      </main>
    </Layout>
  )
}

export default RoleBuilderPage

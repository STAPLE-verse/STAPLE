import { Suspense } from "react"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getRoles from "src/roles/queries/getRoles"
import { AllRolesList } from "src/roles/components/AllRolesList"
import { NewRole } from "src/roles/components/NewRole"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"

const RoleBuilderPage = () => {
  const currentUser = useCurrentUser()

  const [{ roles }, { refetch }] = useQuery(getRoles, {
    where: { user: { id: currentUser?.id } },
    orderBy: { id: "asc" },
  })

  const taxonomyList = Array.from(
    new Set(roles.map((role) => (role.taxonomy || "").trim()).filter((taxonomy) => taxonomy !== ""))
  )

  return (
    <Layout title="Contribution Roles">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center text-3xl items-center">
          All Roles{" "}
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

        <div className="flex justify-center m-4">
          <NewRole taxonomyList={taxonomyList} onRolesChanged={refetch} />
        </div>
        <Card title={""}>
          <Suspense fallback={<div>Loading...</div>}>
            <AllRolesList roles={roles} onRolesChanged={refetch} taxonomyList={taxonomyList} />
          </Suspense>
        </Card>
      </main>
    </Layout>
  )
}

export default RoleBuilderPage

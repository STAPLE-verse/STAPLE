import Layout from "src/core/layouts/Layout"
import { Suspense } from "react"
import PageHeader from "src/core/components/PageHeader"
import {
  CreateMetadata,
  LinkDefaultForms,
  TriggerDefaultForms,
} from "src/updates/component/2025_01_migration"
import useUserAuthorization from "src/userprivileges/hooks/useUserAuthorization"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { TriggerDashboardMigration } from "src/updates/component/2025_03_migration"
import Card from "src/core/components/Card"
import { TriggerMilestoneMutation } from "src/updates/component/2025_05_migration"

const UpdatesPage = () => {
  const user = useCurrentUser()
  useUserAuthorization(user!.role)
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Updates">
      <main className="flex flex-col mx-auto w-full">
        <PageHeader className="flex justify-center mb-2" title="Updates" />
        <Suspense fallback={<div>Loading...</div>}>
          <div>
            <Card title={"Updates May 29, 2025"}>
              <TriggerMilestoneMutation />
            </Card>
            <Card title={"Updates March 19, 2025"}>
              <TriggerDashboardMigration />
            </Card>
            <Card title="Updates January 1, 2025" className="mt-4">
              Please run updates in the following order:
              <TriggerDefaultForms />
              <LinkDefaultForms />
              <CreateMetadata />
            </Card>
            <br />
          </div>
        </Suspense>
      </main>
    </Layout>
  )
}

export default UpdatesPage

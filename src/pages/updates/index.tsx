import Layout from "src/core/layouts/Layout"
import { Suspense } from "react"
import PageHeader from "src/core/components/PageHeader"
import {
  CreateMetadata,
  LinkDefaultForms,
  TriggerDefaultForms,
} from "src/updates/component/2025_01_migration"

const UpdatesPage = () => {
  return (
    <Layout title="Updates">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <PageHeader className="flex justify-center mb-2" title="Updates" />
        <Suspense fallback={<div>Loading...</div>}>
          <div>
            <h3>Updates January 1, 2025</h3>
            Please run updates in the following order:
            <div>
              <TriggerDefaultForms />
            </div>
            <div>
              <LinkDefaultForms />
            </div>
            <div>
              <CreateMetadata />
            </div>
            <br />
          </div>
        </Suspense>
      </main>
    </Layout>
  )
}

export default UpdatesPage

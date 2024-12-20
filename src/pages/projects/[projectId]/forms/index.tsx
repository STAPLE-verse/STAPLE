import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectFormsList } from "src/forms/components/ProjectFormsList"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"

const MetadataPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout title="Form Data">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Form Data</h1>
        {
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectFormsList />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default MetadataPage

import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectFormsList } from "src/forms/components/ProjectFormsList"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { MemberPrivileges } from "db"

const MetadataPage = () => {
  useContributorAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Form Data</title>
      </Head>

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

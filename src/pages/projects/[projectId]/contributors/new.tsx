import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import createContributor from "src/contributors/mutations/createContributor"
import { ContributorForm, FORM_ERROR } from "src/contributors/components/ContributorForm"
import { Suspense } from "react"
import Head from "next/head"
import { z } from "zod"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

// TODO: if not all parameters that are present in the schema are in the returned values of the form the onsubmit fails without error
// TODO: Thus we create a separate schema for the form and the create mutation
export const ContributorFormSchema = z.object({
  userId: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

const NewContributorPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const [createContributorMutation] = useMutation(createContributor)

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Add New Contributor</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Add New Contributor</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ContributorForm
            className="flex flex-col"
            submitText="Add Contributor"
            schema={ContributorFormSchema}
            // initialValues={}
            onSubmit={async (values) => {
              try {
                const contributor = await createContributorMutation({
                  userId: values.userId,
                  projectId: projectId!,
                })
                await router.push(
                  Routes.ShowContributorPage({
                    projectId: projectId!,
                    contributorId: contributor.id,
                  })
                )
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

NewContributorPage.authenticate = true

export default NewContributorPage

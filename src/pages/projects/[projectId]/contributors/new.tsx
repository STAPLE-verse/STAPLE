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
import { ContributorPrivilegesOptions } from "src/contributors/components/ContributorForm"
import toast from "react-hot-toast"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
// TODO: if not all parameters that are present in the schema are in the returned values of the form the onsubmit fails without error
// TODO: Thus we create a separate schema for the form and the create mutation
export const ContributorFormSchema = z.object({
  userId: z.number(),
  privilege: z.number(),
  // template: __fieldName__: z.__zodType__(),
})

const NewContributorPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const [createContributorMutation] = useMutation(createContributor)
  const currentUser = useCurrentUser()

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Add New Contributor</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl">Add New Contributor</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ContributorForm
            projectId={projectId!}
            className="flex flex-col"
            submitText="Add Contributor"
            schema={ContributorFormSchema}
            // initialValues={}
            onSubmit={async (values) => {
              try {
                const contributor = await createContributorMutation({
                  userId: values.userId,
                  projectId: projectId!,
                  privilege: ContributorPrivilegesOptions.find(
                    (option) => option.id === values.privilege
                  )!.value,
                  addedBy: currentUser!.username,
                })
                await toast.promise(Promise.resolve(contributor), {
                  loading: "Adding contributor...",
                  success: "Contributor added to the project!",
                  error: "Failed to add the contributor...",
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

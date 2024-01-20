import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"

import { TeamForm, FORM_ERROR } from "src/teams/components/TeamForm"
import { TeamFormSchema } from "src/teams/schemas"
import { Suspense } from "react"
import Head from "next/head"
import { z } from "zod"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

import { contributorRoleOptions } from "src/contributors/components/ContributorForm"
import toast from "react-hot-toast"

const NewTeamPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")

  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  console.log("new team ")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Add New Team</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Add New Team</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TeamForm
            projectId={projectId!}
            className="flex flex-col"
            submitText="Add Team"
            schema={TeamFormSchema}
            onSubmit={async (values) => {
              console.log("adding team", values)
              try {
                //get this after team is created
                let teamId = 0
                // const contributor = await createContributorMutation({
                //   userId: values.userId,
                //   projectId: projectId!,
                //   role: contributorRoleOptions.find((option) => option.id === values.role)!.value,
                // })
                // await toast.promise(Promise.resolve(contributor), {
                //   loading: "Adding contributor...",
                //   success: "Contributor added to the project!",
                //   error: "Failed to add the contributor...",
                // })

                // await router.push(
                //   Routes.ShowTeamPage({
                //     projectId: projectId!,
                //     teamId: teamId,
                //   })
                // )
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

NewTeamPage.authenticate = true

export default NewTeamPage

// https://blitzjs.com/docs/cli-generate
// https://daily.dev/blog/getting-started-with-blitzjs

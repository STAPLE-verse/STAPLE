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
import createTeam from "src/teams/mutations/createTeam"

const NewTeamPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createTeamMutation] = useMutation(createTeam)

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
              let membersId: number[] = values.contributorsId
                .filter((el) => el.checked)
                .map((val) => val.id)
              console.log(membersId)
              try {
                //get this after team is created

                const team = await createTeamMutation({
                  name: values.name,
                  projectId: projectId!,
                  contributors: membersId,
                })
                await toast.promise(Promise.resolve(team), {
                  loading: "Adding team...",
                  success: "Team added to the project!",
                  error: "Failed to create the team...",
                })

                await router.push(
                  Routes.ShowTeamPage({
                    projectId: projectId!,
                    teamId: team.id,
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

NewTeamPage.authenticate = true

export default NewTeamPage

// https://blitzjs.com/docs/cli-generate
// https://daily.dev/blog/getting-started-with-blitzjs

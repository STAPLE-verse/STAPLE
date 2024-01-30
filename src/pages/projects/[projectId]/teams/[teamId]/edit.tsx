import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import toast from "react-hot-toast"
import getTeam from "src/teams/queries/getTeam"
import { TeamForm, FORM_ERROR } from "src/teams/components/TeamForm"
import { TeamFormSchema } from "src/teams/schemas"
import updateTeam from "src/teams/mutations/updateTeam"

export const EditTeam = () => {
  const router = useRouter()
  const teamId = useParam("teamId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const [team, { setQueryData }] = useQuery(
    getTeam,
    { id: teamId, include: { contributors: true } },
    {
      staleTime: Infinity,
    }
  )
  const [updateTeamMutation] = useMutation(updateTeam)

  const sidebarItems = ProjectSidebarItems(projectId!, null)

  const currentContributorsId =
    team["contributors"] != undefined ? team["contributors"].map((el) => el["id"]) : []

  const initialValues = {
    name: team.name,
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Edit {team.name}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Edit {team.name}</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <TeamForm
              projectId={projectId!}
              teamId={team.id}
              currentContributorsId={currentContributorsId}
              className=""
              initialValues={initialValues}
              submitText="Update Team"
              schema={TeamFormSchema}
              onSubmit={async (values) => {
                let membersId: number[] = values.contributorsId
                  .filter((el) => el.checked)
                  .map((val) => val.id)

                try {
                  const updated = await updateTeamMutation({
                    projectId: projectId!,
                    name: values.name,
                    id: team.id,
                    contributors: membersId,
                  })
                  await toast.promise(Promise.resolve(updated), {
                    loading: "Updating team...",
                    success: "Team updated!",
                    error: "Failed to update team...",
                  })
                  await setQueryData(updated)
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

            <Link
              className="btn self-end mt-4"
              href={Routes.ShowTeamPage({ projectId: projectId!, teamId: teamId! })}
            >
              Cancel
            </Link>
          </Suspense>
        }
      </main>
    </Layout>
  )
}

const EditTeamPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTeam />
      </Suspense>
    </div>
  )
}

EditTeamPage.authenticate = true

export default EditTeamPage

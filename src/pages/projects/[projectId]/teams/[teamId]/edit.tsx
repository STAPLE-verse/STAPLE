import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import toast from "react-hot-toast"
import { TeamForm } from "src/teams/components/TeamForm"
import { FORM_ERROR } from "final-form"
import { TeamFormSchema } from "src/teams/schemas"
import updateTeam from "src/teams/mutations/updateTeam"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { ProjectMemberWithUsers } from ".."
import getProjectMember from "src/projectmembers/queries/getProjectMember"

export const EditTeam = () => {
  const [updateTeamMutation] = useMutation(updateTeam)
  const router = useRouter()
  const teamId = useParam("teamId", "number")
  const projectId = useParam("projectId", "number")
  const [teamProjectMember, { setQueryData }] = useQuery(getProjectMember, {
    where: {
      id: teamId,
      projectId: projectId,
    },
    include: {
      users: true,
    },
  }) as [ProjectMemberWithUsers, any]

  const users = teamProjectMember.users
  const userIds = users.map((user) => user.id)

  const initialValues = {
    name: teamProjectMember.name ? teamProjectMember.name : undefined,
  }

  return (
    <Layout>
      <Head>
        <title>Edit {teamProjectMember.name}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl">Edit {teamProjectMember.name}</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <TeamForm
              projectId={projectId!}
              teamId={teamProjectMember.id}
              currentProjectMemberIds={userIds}
              initialValues={initialValues}
              submitText="Update Team"
              schema={TeamFormSchema}
              onSubmit={async (values) => {
                const teamMemberUserIds: number[] = values.projectMembers
                  .filter((el) => el.checked)
                  .map((val) => val.userId)

                try {
                  const updated = await updateTeamMutation({
                    name: values.name,
                    id: teamProjectMember.id,
                    userIds: teamMemberUserIds,
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
                      teamId: teamProjectMember.id,
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
              className="btn btn-secondary self-end mt-4"
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
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditTeam />
    </Suspense>
  )
}

EditTeamPage.authenticate = true

export default EditTeamPage

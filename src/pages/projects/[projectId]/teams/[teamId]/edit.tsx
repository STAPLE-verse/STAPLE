import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
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
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import PageHeader from "src/core/components/PageHeader"
import { ProjectMemberWithUsers } from "src/core/types"

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
    projectMemberUserIds: userIds,
  }

  // Handle events
  const handleEditTeam = async (values) => {
    try {
      const updated = await updateTeamMutation({
        name: values.name,
        id: teamProjectMember.id,
        userIds: values.projectMemberUserIds,
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
  }

  return (
    <>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <PageHeader title={`Edit ${teamProjectMember.name}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <TeamForm
            projectId={projectId!}
            initialValues={initialValues}
            submitText="Update Team"
            schema={TeamFormSchema}
            onSubmit={handleEditTeam}
          />

          <Link
            className="btn btn-secondary self-end mt-4"
            href={Routes.ShowTeamPage({ projectId: projectId!, teamId: teamId! })}
          >
            Cancel
          </Link>
        </Suspense>
      </main>
    </>
  )
}

const EditTeamPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Edit Team Page">
      <Suspense fallback={<div>Loading...</div>}>
        <EditTeam />
      </Suspense>
    </Layout>
  )
}

EditTeamPage.authenticate = true

export default EditTeamPage

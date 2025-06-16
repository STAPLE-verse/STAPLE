import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
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
import { ProjectMemberWithUsers } from "src/core/types"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"

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
    tags:
      Array.isArray(teamProjectMember.tags) &&
      teamProjectMember.tags.every((tag) => typeof tag === "object" && tag !== null)
        ? teamProjectMember.tags.map((tag) => ({
            id: (tag as any).key ?? "",
            text: (tag as any).value ?? "",
            key: (tag as any).key ?? "",
            value: (tag as any).value ?? "",
          }))
        : [],
  }

  // Handle events
  const handleEditTeam = async (values) => {
    try {
      const updated = await updateTeamMutation({
        name: values.name,
        id: teamProjectMember.id,
        userIds: values.projectMemberUserIds,
        tags: values.tags,
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

  // Handle cancel event
  const handleCancel = async () => {
    await router.push(
      Routes.ShowTeamPage({
        projectId: projectId!,
        teamId: teamId!,
      })
    )
  }

  return (
    <>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center mb-2 text-3xl">
          {`Edit ${teamProjectMember.name}`}
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="team-tooltip"
          />
          <Tooltip
            id="team-tooltip"
            content="Use this page to edit the team name and membership."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Card title="">
            <TeamForm
              projectId={projectId!}
              initialValues={initialValues}
              submitText="Update Team"
              schema={TeamFormSchema}
              onSubmit={handleEditTeam}
              cancelText="Cancel"
              onCancel={handleCancel}
            />
          </Card>

          {/* The cancel button is now handled by the TeamForm's onCancel */}
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

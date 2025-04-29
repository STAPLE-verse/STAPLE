import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { TeamForm } from "src/teams/components/TeamForm"
import { FORM_ERROR } from "final-form"
import { TeamFormSchema } from "src/teams/schemas"
import { Suspense } from "react"
import Head from "next/head"
import toast from "react-hot-toast"
import createTeam from "src/teams/mutations/createTeam"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import PageHeader from "src/core/components/PageHeader"

const NewTeamContent = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createTeamMutation] = useMutation(createTeam)

  const handleNewTeam = async (values) => {
    try {
      //get this after team is created
      const team = await createTeamMutation({
        name: values.name,
        projectId: projectId!,
        userIds: values.projectMemberUserIds,
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
  }

  return (
    <TeamForm
      projectId={projectId!}
      className="flex flex-col"
      submitText="Add Team"
      schema={TeamFormSchema}
      onSubmit={handleNewTeam}
    />
  )
}

const NewTeamPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Add New Team">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <PageHeader title="Add New Team" />
        <Suspense fallback={<div>Loading...</div>}>
          <NewTeamContent />
        </Suspense>
      </main>
    </Layout>
  )
}

NewTeamPage.authenticate = true

export default NewTeamPage

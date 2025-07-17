import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormMilestoneSchema } from "src/milestones/schemas"
import { MilestoneForm } from "src/milestones/components/MilestoneForm"
import { FORM_ERROR } from "final-form"
import { Suspense } from "react"
import { useParam } from "@blitzjs/next"
import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import createMilestone from "src/milestones/mutations/createMilestone"
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import getTasks from "src/tasks/queries/getTasks"

const NewMilestonePage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createMilestoneMutation] = useMutation(createMilestone)
  const [{ tasks }] = useQuery(getTasks, { where: { projectId: projectId } })

  const handleNewMilestone = async (values) => {
    try {
      const milestone = await createMilestoneMutation({
        ...values,
        projectId: projectId!,
      })

      await toast.promise(Promise.resolve(milestone), {
        loading: "Creating milestone...",
        success: "Milestone created!",
        error: "Failed to create the milestone...",
      })

      await router.push(
        Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: milestone.id })
      )
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Create New Milestone">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex mb-2 justify-center items-center text-3xl">
          Create New Milestone
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="new-project"
          />
          <Tooltip
            id="new-project"
            className="z-[1099] ourtooltips"
            content="Milestones allow you to group together tasks and visualize them in a Gantt timeline chart."
          />
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Card title="">
            <MilestoneForm
              submitText="Create Milestone"
              schema={FormMilestoneSchema}
              tasks={tasks}
              onSubmit={handleNewMilestone}
              cancelText="Cancel"
              onCancel={() =>
                router.push(
                  Routes.MilestonesPage({
                    projectId: projectId!,
                  })
                )
              }
            />
          </Card>
        </Suspense>
      </main>
    </Layout>
  )
}

NewMilestonePage.authenticate = true

export default NewMilestonePage

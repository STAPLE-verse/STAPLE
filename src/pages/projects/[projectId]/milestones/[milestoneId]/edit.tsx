import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { FormMilestoneSchema } from "src/milestones/schemas"
import getMilestone from "src/milestones/queries/getMilestone"
import updateMilestone from "src/milestones/mutations/updateMilestone"
import { MilestoneForm } from "src/milestones/components/MilestoneForm"
import { FORM_ERROR } from "final-form"

import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import getTasks from "src/tasks/queries/getTasks"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"

export type Tag = {
  id: string
  className: string
  [key: string]: string
}

export const EditMilestone = () => {
  const [updateMilestoneMutation] = useMutation(updateMilestone)
  const router = useRouter()
  const milestoneId = useParam("milestoneId", "number")
  const projectId = useParam("projectId", "number")
  const [milestone, { setQueryData }] = useQuery(getMilestone, { id: milestoneId })

  const initialValues = {
    name: milestone.name,
    description: milestone.description,
    startDate: milestone.startDate ? new Date(milestone.startDate) : undefined,
    endDate: milestone.endDate ? new Date(milestone.endDate) : undefined,
    tags: Array.isArray(milestone.tags)
      ? (milestone.tags as { key: string; value: string }[]).map((tag) => ({
          id: `${tag.key}-${tag.value}`,
          key: tag.key ?? "",
          value: tag.value ?? "",
          text: tag.value ?? "",
        }))
      : [],
    taskIds: milestone.task.map((task) => task.id) ?? [],
  }

  const [{ tasks }] = useQuery(getTasks, { where: { projectId: projectId } })

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Edit Milestone Page">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex mb-2 justify-center items-center text-3xl">
          Edit Milestone:{" "}
          <span className="italic ml-2">
            {milestone.name.length > 50 ? milestone.name.slice(0, 50) + "…" : milestone.name}
          </span>
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
        <Card title="">
          <MilestoneForm
            submitText="Save Milestone"
            tasks={tasks}
            schema={FormMilestoneSchema}
            initialValues={initialValues}
            cancelText="Cancel"
            onCancel={() =>
              router.push(
                Routes.ShowMilestonePage({
                  projectId: projectId!,
                  milestoneId: milestone.id,
                })
              )
            }
            onSubmit={async (values) => {
              try {
                const updated = await updateMilestoneMutation({
                  id: milestone.id,
                  ...values,
                })
                await toast.promise(Promise.resolve(updated), {
                  loading: "Updating milestone...",
                  success: "Milestone updated!",
                  error: "Failed to update the milestone...",
                })
                await setQueryData({ ...milestone, ...updated })
                await router.push(
                  Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: updated.id })
                )
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Card>
      </main>
    </Layout>
  )
}

const EditMilestonePage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditMilestone />
    </Suspense>
  )
}

EditMilestonePage.authenticate = true

export default EditMilestonePage

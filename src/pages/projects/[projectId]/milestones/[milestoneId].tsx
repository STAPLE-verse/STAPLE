import Layout from "src/core/layouts/Layout"
import getMilestone from "src/milestones/queries/getMilestone"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes, useParam } from "@blitzjs/next"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { MilestoneInformation } from "src/milestones/components/MilestoneInformation"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Link from "next/link"
import UpdateTasksMilestone from "src/milestones/components/UpdateTasksMilestone"
import { useState } from "react"
import { processMilestoneTasks } from "src/milestones/tables/processing/processMilestoneTasks"
import type { MilestoneTasksData } from "src/milestones/tables/processing/processMilestoneTasks"
import getTasks from "src/tasks/queries/getTasks"
import router from "next/router"
import deleteMilestone from "src/milestones/mutations/deleteMilestone"

const ShowMilestonePage = () => {
  // ProjectMember authentication
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])
  const { privilege } = useMemberPrivileges()

  // Get milestones
  const projectId = useParam("projectId", "number")
  const milestoneId = useParam("milestoneId", "number")
  const [milestone, { refetch: refetchMilestone }] = useQuery(getMilestone, { id: milestoneId })
  const [deleteMilestoneMutation] = useMutation(deleteMilestone)
  // Delete event
  const handleDelete = async () => {
    if (window.confirm("This milestone will be deleted. Is that ok?")) {
      await deleteMilestoneMutation({ id: milestone.id })
      await router.push(Routes.MilestonesPage({ projectId: projectId! }))
    }
  }

  // for update tasks
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const [{ tasks }, { refetch: refetchTasks }] = useQuery(getTasks, {
    where: {
      project: { id: projectId! },
    },
    orderBy: { id: "asc" },
  })
  const milestoneTasks = tasks.filter((task) => task.milestoneId === milestone.id)
  const processedTasks = processMilestoneTasks(milestoneTasks)

  console.log(processedTasks)

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Milestone Page">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center text-3xl">
          Milestone:{" "}
          <span className="italic ml-2">
            {milestone.name.length > 50 ? milestone.name.slice(0, 50) + "…" : milestone.name}
          </span>
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="team-tooltip"
          />
          <Tooltip
            id="team-tooltip"
            content="This page allows you to review the contributors information, overall sttatistics, and tasks they are assigned to as an individual."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <div className="gap-2 justify-center items-center flex m-4">
          <Link
            className="btn btn-primary"
            href={Routes.EditMilestonePage({ projectId: projectId!, milestoneId: milestone.id })}
          >
            Update Milestone
          </Link>

          <button className="btn btn-secondary" onClick={openModal}>
            Update Tasks
          </button>
          <UpdateTasksMilestone
            milestoneId={milestone.id}
            open={isModalOpen}
            onClose={closeModal}
            onTasksUpdated={refetchTasks}
            tasks={tasks}
          />

          <button type="button" className="btn btn-warning" onClick={handleDelete}>
            Delete Milestone
          </button>
        </div>
        <div>
          <MilestoneInformation
            milestone={milestone}
            processedTasks={processedTasks}
            projectId={projectId!}
          />
        </div>
      </main>
    </Layout>
  )
}

ShowMilestonePage.authenticate = true

export default ShowMilestonePage

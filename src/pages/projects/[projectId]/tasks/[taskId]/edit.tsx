import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormTaskSchema } from "src/tasks/schemas"
import updateTask from "src/tasks/mutations/updateTask"
import { Tag, TaskForm } from "src/tasks/components/TaskForm"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import TaskLayout from "src/core/layouts/TaskLayout"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { ProjectMemberWithTaskLog } from "src/core/types"
import { responseSubmitted } from "src/tasklogs/utils/responseSubmitted"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import PageHeader from "src/core/components/PageHeader"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

export const EditTask = () => {
  //Setup
  const router = useRouter()
  const [updateTaskMutation] = useMutation(updateTask)

  // Get tasks and assignments
  const { task, projectMembers, refetchTaskData } = useTaskContext()

  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithTaskLog>(projectMembers)

  // Get individual projectMember ids
  const projectMembersId = individualProjectMembers
    .map((projectMember) => projectMember.id)
    .filter((id): id is number => id !== null)

  // Get team member projectMember ids
  const teamsId = teamProjectMembers
    .map((projectMember) => projectMember.id)
    .filter((id): id is number => id !== null)

  // Prepopulate form with previous responses
  const rolesId = task.roles?.map((role: { id: number }) => role.id) || []

  const initialValues = {
    name: task.name,
    description: task.description!,
    containerId: task.containerId,
    deadline: task.deadline,
    projectMembersId: projectMembersId,
    teamsId: teamsId,
    formVersionId: task.formVersionId,
    rolesId: rolesId,
    milestoneId: task.milestoneId,
    tags: Array.isArray(task.tags)
      ? (task.tags as Tag[]).map((tag) => ({
          id: tag.key, // Use 'key' as the ID
          text: tag.value, // Display the tag's value as text
        }))
      : [],
  }

  // Check if any assignment is COMPLETED
  const formResponseSupplied = responseSubmitted(task)

  // Handle form submit
  const handleSubmit = async (values) => {
    const toastId = "update-task-id"
    toast.dismiss(toastId)
    toast.loading("Updating task...", { id: toastId })

    try {
      await updateTaskMutation({
        ...values,
        id: task.id,
      })

      await refetchTaskData()

      toast.success("Task updated!", { id: toastId })

      await router.push(
        Routes.ShowTaskPage({
          projectId: task.projectId,
          taskId: task.id,
        })
      )
    } catch (error: any) {
      console.error(error)
      toast.error("Failed to update the task...", { id: toastId })
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center text-3xl">
          Edit: <span className="ml-2 italic">{task.name}</span>
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="task-update"
          />
          <Tooltip
            id="task-update"
            content="Use this page to update/edit a task. You can add new people or teams that are required to complete the task. If you included a form in the original task, you need to create a new task to change it. "
            className="z-[1099] ourtooltips"
          />
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            projectId={task.projectId}
            formResponseSupplied={formResponseSupplied}
            submitText="Update Task"
            schema={FormTaskSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={() =>
              router.push(Routes.ShowTaskPage({ projectId: task.projectId, taskId: task.id }))
            }
            cancelText="Cancel"
          />
        </Suspense>
      </main>
    </>
  )
}

const EditTaskPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Edit Task Page">
      <TaskLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <EditTask />
        </Suspense>
      </TaskLayout>
    </Layout>
  )
}

EditTaskPage.authenticate = true

export default EditTaskPage

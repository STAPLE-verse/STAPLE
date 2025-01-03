import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormTaskSchema } from "src/tasks/schemas"
import updateTask from "src/tasks/mutations/updateTask"
import { TaskForm } from "src/tasks/components/TaskForm"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import TaskLayout from "src/core/layouts/TaskLayout"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { ProjectMemberWithTaskLog, useTaskContext } from "src/tasks/components/TaskContext"
import { responseSubmitted } from "src/tasklogs/utils/responseSubmitted"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import PageHeader from "src/core/components/PageHeader"

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
    elementId: task.elementId,
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
        <PageHeader title={`Edit ${task.name}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            projectId={task.projectId}
            formResponseSupplied={formResponseSupplied}
            submitText="Update Task"
            schema={FormTaskSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />
          <Link
            className="btn self-end mt-4 btn-error"
            href={Routes.ShowTaskPage({ projectId: task.projectId, taskId: task.id })}
          >
            Cancel
          </Link>
        </Suspense>
      </main>
    </>
  )
}

const EditTaskPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
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

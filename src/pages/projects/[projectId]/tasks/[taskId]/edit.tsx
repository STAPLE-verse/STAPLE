import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
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
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "db"
import { useTaskContext } from "src/tasks/components/TaskContext"

export const EditTask = () => {
  // Ensure that only PM can edit a task
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])
  //Setup
  const router = useRouter()
  const [updateTaskMutation] = useMutation(updateTask)
  // Get tasks and assignments
  const { task, individualAssignments, teamAssignments, refetchTaskData } = useTaskContext()

  // Calculate individual contributor ids
  const contributorsId = individualAssignments
    .map((assignment) => assignment.contributorId)
    // assignment.contributorId is nullable thus we filter for initialValues
    .filter((id): id is number => id !== null)

  // Calculate team member contributor ids
  const teamsId = teamAssignments
    .map((assignment) => assignment.teamId)
    // assignment.contributorId is nullable thus we filter for initialValues
    .filter((id): id is number => id !== null)

  const initialValues = {
    name: task.name,
    description: task.description!,
    columnId: task.columnId,
    deadline: task.deadline,
    contributorsId: contributorsId,
    teamsId: teamsId,
    formVersionId: task.formVersionId,
    elementId: task.elementId,
  }

  return (
    <>
      <Head>
        <title>Edit {task.name}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl">Edit {task.name}</h1>
        {/* For debugging Task schema */}
        {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            projectId={task.projectId}
            formResponseSupplied={true}
            submitText="Update Task"
            schema={FormTaskSchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
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
            }}
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
  return (
    <Layout>
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

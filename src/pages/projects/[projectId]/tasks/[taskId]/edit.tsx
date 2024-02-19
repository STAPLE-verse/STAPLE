import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { FormTaskSchema } from "src/tasks/schemas"
import getTask from "src/tasks/queries/getTask"
import updateTask from "src/tasks/mutations/updateTask"
import { TaskForm, FORM_ERROR } from "src/tasks/components/TaskForm"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import toast from "react-hot-toast"

export const EditTask = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const [task, { setQueryData }] = useQuery(
    getTask,
    { id: taskId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTaskMutation] = useMutation(updateTask)

  const sidebarItems = ProjectSidebarItems(projectId!, null)

  // I have to make initial values explicit for the update to work why?
  const initialValues = {
    name: task.name,
    description: task.description!,
    columnId: task.columnId,
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Edit {task.name}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Edit {task.name}</h1>
        {/* For debugging Task schema */}
        {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            taskId={taskId}
            projectId={projectId}
            submitText="Update Task"
            schema={FormTaskSchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
              // console.log(values)
              try {
                // if (true) return
                const updated = await updateTaskMutation({
                  ...values,
                  id: task.id,
                })

                await toast.promise(Promise.resolve(updated), {
                  loading: "Updating task...",
                  success: "Task updated!",
                  error: "Failed to update the task...",
                })

                await setQueryData(updated)
                await router.push(
                  Routes.ShowTaskPage({
                    projectId: projectId!,
                    taskId: task.id,
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
            className="btn self-end mt-4"
            href={Routes.ShowTaskPage({ projectId: projectId!, taskId: taskId! })}
          >
            Cancel
          </Link>
        </Suspense>
      </main>
    </Layout>
  )
}

const EditTaskPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTask />
      </Suspense>
    </div>
  )
}

EditTaskPage.authenticate = true

export default EditTaskPage

import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import { UpdateTaskSchema } from "src/tasks/schemas"
import getTask from "src/tasks/queries/getTask"
import updateTask from "src/tasks/mutations/updateTask"
import { TaskForm, FORM_ERROR } from "src/tasks/components/TaskForm"

export const EditTask = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [task, { setQueryData }] = useQuery(
    getTask,
    { id: taskId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTaskMutation] = useMutation(updateTask)

  // I have to make initial values explicit for the update to work why?
  const initialValues = {
    id: task.id,
    name: task.name,
    description: task.description!,
    columnId: task.columnId,
  }

  return (
    <>
      <Head>
        <title>Edit {task.name}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Edit {task.name}</h1>
        {/* For debugging Task schema */}
        {/* <pre>{JSON.stringify(task, null, 2)}</pre> */}
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            submitText="Update Task"
            schema={UpdateTaskSchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                const updated = await updateTaskMutation({
                  // id: task.id,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(
                  Routes.ShowTaskPage({
                    projectId: projectId!,
                    taskId: updated.id,
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
    </>
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
EditTaskPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default EditTaskPage

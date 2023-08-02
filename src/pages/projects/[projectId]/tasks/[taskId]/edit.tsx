import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
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

  return (
    <>
      <Head>
        <title>Edit {task.name}</title>
      </Head>

      <main>
        <h1>Edit {task.name}</h1>
        <pre>{JSON.stringify(task, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            submitText="Update Task"
            schema={UpdateTaskSchema}
            initialValues={task}
            onSubmit={async (values) => {
              try {
                const updated = await updateTaskMutation({
                  id: task.id,
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
        </Suspense>
      </main>
    </>
  )
}

const EditTaskPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTask />
      </Suspense>

      <p>
        <Link href={Routes.TasksPage({ projectId: projectId! })}>Tasks</Link>
      </p>
    </div>
  )
}

EditTaskPage.authenticate = true
EditTaskPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTaskPage

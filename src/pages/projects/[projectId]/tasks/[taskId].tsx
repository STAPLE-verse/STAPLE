import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import ProjectLayout from "src/core/layouts/ProjectLayout"
import Layout from "src/core/layouts/Layout"
import getTask from "src/tasks/queries/getTask"
import deleteTask from "src/tasks/mutations/deleteTask"

export const Task = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [task] = useQuery(getTask, { id: taskId })

  return (
    <>
      <Head>
        <title>Task {task.id}</title>
      </Head>

      <div>
        <h1>Task {task.id}</h1>
        <pre>{JSON.stringify(task, null, 2)}</pre>

        <Link href={Routes.EditTaskPage({ projectId: projectId!, taskId: task.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTaskMutation({ id: task.id })
              await router.push(Routes.TasksPage({ projectId: projectId! }))
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTaskPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <p>
        <Link href={Routes.TasksPage({ projectId: projectId! })}>Tasks</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Task />
      </Suspense>
    </div>
  )
}

ShowTaskPage.authenticate = true
ShowTaskPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default ShowTaskPage

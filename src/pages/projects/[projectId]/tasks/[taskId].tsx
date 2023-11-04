import { Suspense, useState } from "react"
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
import AssignmentModal from "src/assignments/components/AssignmentModal"
import JsonForm from "src/services/jsonconverter/JsonForm"
export const Task = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  return (
    <>
      <Head>
        <title>Task {task.name}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>{task.name}</h1>
        <div className="flex flex-col gap-2">
          <p>{task.description}</p>
          <p>
            <span className="font-semibold">Status:</span> {task["column"].name}
          </p>
          <p>
            <span className="font-semibold">Element:</span>{" "}
            {task["element"] ? task["element"].name : "no elements"}
          </p>
          <p className="italic">Last update: {task.updatedAt.toString()}</p>
        </div>
        <div className="mt-4">
          <button className="btn" onClick={() => handleToggle()}>
            Do task assignment
          </button>
          <AssignmentModal open={openAssignmentModal}>
            <div>{JsonForm()}</div>
            <div className="modal-action">
              {/* closes the modal */}
              <button className="btn btn-primary" onClick={handleToggle}>
                Close
              </button>
            </div>
          </AssignmentModal>
        </div>

        <div className="flex justify-start mt-4">
          <Link
            className="btn"
            href={Routes.EditTaskPage({ projectId: projectId!, taskId: task.id })}
          >
            Update task
          </Link>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn"
            onClick={async () => {
              if (
                window.confirm("The task will be permanently deleted. Are you sure to continue?")
              ) {
                await deleteTaskMutation({ id: task.id })
                await router.push(Routes.TasksPage({ projectId: projectId! }))
              }
            }}
          >
            Delete task
          </button>
        </div>
      </main>
    </>
  )
}

const ShowTaskPage = () => {
  return (
    <div>
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

import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTask from "src/tasks/queries/getTask"
import deleteTask from "src/tasks/mutations/deleteTask"
import JsonForm from "src/assignments/components/JsonForm"

// Load these from database
import testJson2 from "src/services/jsonconverter/testjson.js"

import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { UploadForm } from "src/assignments/components/UploadForm"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import getProject from "src/projects/queries/getProject"
import Modal from "src/core/components/Modal"

export const ShowTaskPage = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  // Get sidebar options
  const sidebarItems = ProjectSidebarItems(projectId!, null)

  //For setting the currentSchema
  // const [currentSchema, setCurrentSchema] = useState(defaultSchemas[0])

  const handleJsonFormSubmit = (data) => {
    console.log(data.formData)
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
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
            <p>
              <span className="font-semibold">Current metadata schema:</span>{" "}
              {task["schema"] ? JSON.stringify(task["schema"]) : "no metadata schema assigned"}
            </p>
          </div>

          {/* <div className="mt-4">
            <button className="btn" onClick={() => handleToggle()}>
              Provide metadata
            </button>
            <Modal open={openAssignmentModal} size="w-11/12 max-w-5xl">
              <div className="font-sans">
                {
                  <JsonForm
                    onSubmit={handleJsonFormSubmit}
                    schema={getJsonSchema(getCurrentJson(currentSchema))}
                    onError={handleJsonFormError}
                  />
                }
              </div>
              <div className="modal-action">
                <button className="btn btn-primary" onClick={handleToggle}>
                  Close
                </button>
              </div>
            </Modal>
          </div> */}

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
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage

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
import AssignmentModal from "src/assignments/components/AssignmentModal"
import JsonForm from "src/services/jsonconverter/JsonForm"

// Load these from database
import testJson2 from "src/services/jsonconverter/testjson.js"
import JsonSchema1 from "src/services/jsonconverter/schema1"
import JsonSchema2 from "src/services/jsonconverter/schema2"

import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { UploadForm } from "src/services/jsonconverter/components/UploadForm"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import getProject from "src/projects/queries/getProject"

//get from db
const defaultSchemas = [
  {
    id: 0,
    name: "Schema 1",
  },
  {
    id: 1,
    name: "Schema 2",
  },
]
function getCurrentJson(schema) {
  const currentJsons = [JsonSchema1, JsonSchema2]
  if (schema.id < currentJsons.length) {
    return currentJsons[schema.id]
  }
  return JsonSchema1
}

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

  const sidebarItems = ProjectSidebarItems(projectId!, null)

  //For setting the currentSchema
  const [currentSchema, setCurrentSchema] = useState(defaultSchemas[0])

  //For openning the upload form during testing
  //this will be removed
  const [openJsonModal, setOpenJsonModal] = useState(false)
  const handleToggleJsonUpload = () => {
    setOpenJsonModal((prev) => !prev)
  }

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
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <p>Current Schema: {currentSchema ? currentSchema.name : ""}</p>
            <div className="mt-4">
              <button className="btn" onClick={() => handleToggleJsonUpload()}>
                Change Current Schema
              </button>
              <AssignmentModal open={openJsonModal} size="w-11/12 max-w-3xl">
                <div>
                  <UploadForm
                    submitText="Change"
                    schemas={defaultSchemas}
                    onSubmit={async (values) => {
                      //Here call submit function
                      const payload = new FormData()
                      if (values.files != undefined) {
                        payload.append("file", values.files[0])
                      } else {
                        setCurrentSchema(defaultSchemas[values.schema])
                      }

                      console.log("Uploading json", values, payload)
                    }}
                  ></UploadForm>
                </div>
                <div className="modal-action">
                  {/* closes the modal */}
                  <button className="btn btn-primary" onClick={handleToggleJsonUpload}>
                    Close
                  </button>
                </div>
              </AssignmentModal>
            </div>
          </div>

          <div className="mt-4">
            <button className="btn" onClick={() => handleToggle()}>
              Assign Schema
            </button>
            <AssignmentModal open={openAssignmentModal} size="w-11/12 max-w-5xl">
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
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage

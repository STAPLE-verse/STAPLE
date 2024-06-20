// @ts-nocheck
import { TaskProvider, TaskContext } from "src/tasks/components/TaskContext"
import { Suspense, useContext, useState } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProject from "src/projects/queries/getProject"
import Table from "src/core/components/Table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DownloadJSON from "src/forms/components/DownloadJSON"
import DownloadXLSX from "src/forms/components/DownloadXLSX"
import Modal from "src/core/components/Modal"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import JsonForm from "src/assignments/components/JsonForm"

const TaskContent = () => {
  const taskContext = useContext(TaskContext)
  const { task } = taskContext
  const projectId = useParam("projectId", "number")
  const taskId = useParam("taskId", "number")
  if (!task) {
    return <div>Loading...</div>
  }

  // modal for review
  const [openMetadataInspectModal, setOpenMetadataInspectModal] = useState(false)
  const handleMetadataInspectToggle = () => {
    setOpenMetadataInspectModal((prev) => !prev)
  }
  const uiSchema = task["ui"] || {}
  let extendedUiSchema = {}
  // TODO: This assumes uiSchema is always an object, although the type def allows for string, number(?) as well
  // I am not sure where would we encounter those
  if (uiSchema && typeof uiSchema === "object" && !Array.isArray(uiSchema)) {
    // We do not want to show the submit button
    extendedUiSchema = {
      ...uiSchema,
      "ui:submitButtonOptions": {
        norender: true,
      },
    }
  }

  const statusLogs = task.assignees.flatMap((people) => people.statusLogs)
  const printForm = statusLogs.filter((complete) => {
    return complete.status == "COMPLETED"
  })
  const dataForm = printForm.flatMap((meta, idx, arr) => {
    const contributorId = meta.completedBy // always returns who did it
    const assignment = task.assignees.find((contributor) => {
      return contributor.contributorId === contributorId
      // this should return null when team because contributor.contributorId is null when team
      // but it will always find something, since this isn't technically a filtered loop
      // return contributorId and teamId
    })
    return {
      userId: assignment.contributor.userId,
      teamId: "...",
      createdAt: meta.createdAt,
      ...meta.metadata,
    }
  })

  //console.log(dataForm)

  const makeTableColumns = () => {
    const schemaProps = task.schema.properties
    let columns = [
      {
        header: "Completed By",
        accessorKey: "userId",
        id: "userId",
      },
      {
        header: "Changed At",
        accessorKey: "createdAt",
        id: "createdAt",
      },
    ]

    for (const [key, value] of Object.entries(schemaProps)) {
      if (typeof value === "object" && value !== null) {
        const columnObject = {
          header: value.title,
          accessorKey: key,
          id: key,
        }
        columns.push(columnObject)
      }
    }
    return columns
  }

  return (
    <>
      <Head>
        <title>Form Data for {task.name}</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <div className="flex flex-row justify-center">
          <div className="card bg-base-300 mb-2 w-full">
            <div className="card-body">
              <div className="flex justify-center">
                <button className="btn btn-primary" onClick={() => handleMetadataInspectToggle()}>
                  Form Requirements
                </button>
                <Modal open={openMetadataInspectModal} size="w-11/12 max-w-5xl">
                  <div className="font-sans">
                    {
                      <JsonForm
                        schema={getJsonSchema(task["schema"])}
                        uiSchema={extendedUiSchema}
                      />
                    }
                  </div>
                  <div className="modal-action">
                    <button className="btn btn-primary" onClick={handleMetadataInspectToggle}>
                      Close
                    </button>
                  </div>
                </Modal>

                <Link
                  className="btn btn-secondary mx-2"
                  href={Routes.AssignmentsPage({
                    projectId: projectId,
                    taskId: taskId,
                  })}
                >
                  Review and Edit Form Tasks
                </Link>

                <DownloadJSON data={dataForm} fileName={task.name} className="btn btn-info" />

                <DownloadXLSX
                  data={dataForm}
                  fileName={task.name}
                  className="btn btn-accent mx-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center">
          <div className="card bg-base-300 w-full">
            <div className="card-body overflow-x-auto">
              <div className="card-title">Form Data for {task.name}</div>
              <Table columns={makeTableColumns()} data={dataForm} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// show the Task page
export const ShowFormPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const taskId = useParam("taskId", "number")

  // return the page
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskProvider taskId={taskId}>
          <TaskContent />
        </TaskProvider>
      </Suspense>
    </Layout>
  )
}

ShowFormPage.authenticate = true

export default ShowFormPage

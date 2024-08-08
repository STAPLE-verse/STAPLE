import { useTaskContext } from "src/tasks/components/TaskContext"
import { Suspense, useState } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DownloadJSON from "src/forms/components/DownloadJSON"
import DownloadXLSX from "src/forms/components/DownloadXLSX"
import DownloadZIP from "src/forms/components/DownloadZIP"
import Modal from "src/core/components/Modal"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import JsonForm from "src/assignments/components/JsonForm"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "db"
import TaskLayout from "src/core/layouts/TaskLayout"

const FormContent = () => {
  // Ensure that only PM can edit a task
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  // Get tasks and assignments
  const { task } = useTaskContext()

  // Modal for review
  const [openMetadataInspectModal, setOpenMetadataInspectModal] = useState(false)
  const handleMetadataInspectToggle = () => {
    setOpenMetadataInspectModal((prev) => !prev)
  }

  const uiSchema = task.formVersion?.uiSchema || {}
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
    return complete!.status == "COMPLETED"
  })
  const dataForm = printForm.flatMap((meta) => {
    const contributorId = meta!.completedBy // always returns who did it
    const assignment = task.assignees.find((contributor) => {
      return contributor.contributorId === contributorId
      // this should return null when team because contributor.contributorId is null when team
      // but it will always find something, since this isn't technically a filtered loop
      // return contributorId and teamId
    })
    return {
      userId: assignment.contributor.userId,
      teamId: "...",
      createdAt: meta!.createdAt,
      ...meta.metadata,
    }
  })

  //console.log(dataForm)

  const makeTableColumns = () => {
    const schemaProps = task.formVersion?.schema?.properties
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
                        schema={getJsonSchema(task.formVersion?.schema)}
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
                    projectId: task.projectId,
                    taskId: task.id,
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
                <DownloadZIP data={dataForm} fileName={task.name} className="btn btn-info mx-2" />
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

export const ShowFormPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskLayout>
          <FormContent />
        </TaskLayout>
      </Suspense>
    </Layout>
  )
}

ShowFormPage.authenticate = true

export default ShowFormPage

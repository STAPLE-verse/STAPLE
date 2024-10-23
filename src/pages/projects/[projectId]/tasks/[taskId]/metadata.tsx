import { useTaskContext } from "src/tasks/components/TaskContext"
import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DownloadJSON from "src/forms/components/DownloadJSON"
import DownloadXLSX from "src/forms/components/DownloadXLSX"
import DownloadZIP from "src/forms/components/DownloadZIP"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import TaskLayout from "src/core/layouts/TaskLayout"
import { extendSchema } from "src/forms/utils/extendSchema"
import { processMetadata } from "src/forms/utils/processMetadata"
import { metadataTable } from "src/forms/utils/metadataTable"
import { JsonFormModal } from "src/core/components/JsonFormModal"

const MetadataContent = () => {
  // Ensure that only PM can edit a task
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  // Get tasks
  const { task, projectMembers } = useTaskContext()

  // Extend uiSchema so submit button is not shown
  const extendedUiSchema = extendSchema({
    schema: task.formVersion?.uiSchema || {},
    extension: {
      "ui:submitButtonOptions": {
        norender: true,
      },
    },
  })

  // Prepare data for the metadatatable
  const processedMetadata = processMetadata(projectMembers)

  // Create table definitions based on the schema
  const metadataTableColumns = metadataTable(task.formVersion?.schema)

  return (
    <>
      <Head>
        <title>Form Data for {task.name}</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-row justify-center">
          <div className="card bg-base-300 mb-2 w-full">
            <div className="card-body">
              <div className="flex justify-center">
                <JsonFormModal
                  schema={getJsonSchema(task.formVersion?.schema)}
                  uiSchema={extendedUiSchema}
                  label="Form Requirements"
                  classNames="btn-primary"
                />

                <Link
                  className="btn btn-secondary mx-2"
                  href={Routes.AssignmentsPage({
                    projectId: task.projectId,
                    taskId: task.id,
                  })}
                >
                  Review and Edit Form Tasks
                </Link>
                <DownloadJSON
                  data={processedMetadata}
                  fileName={task.name}
                  className="btn btn-info"
                />
                <DownloadXLSX
                  data={processedMetadata}
                  fileName={task.name}
                  className="btn btn-accent mx-2"
                />
                <DownloadZIP
                  data={processedMetadata}
                  fileName={task.name}
                  className="btn btn-info"
                />
              </div>
            </div>
          </div>
        </div>
        {/* List of form responses */}
        <div className="flex flex-row justify-center">
          <div className="card bg-base-300 w-full">
            <div className="card-body overflow-x-auto">
              <div className="card-title">Form Data for {task.name}</div>
              <Table columns={metadataTableColumns} data={processedMetadata} addPagination={true} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export const ShowMetadataPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskLayout>
          <MetadataContent />
        </TaskLayout>
      </Suspense>
    </Layout>
  )
}

ShowMetadataPage.authenticate = true

export default ShowMetadataPage

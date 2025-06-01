import { useTaskContext } from "src/tasks/components/TaskContext"
import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DownloadJSON from "src/forms/components/DownloadJSON"
import DownloadXLSX from "src/forms/components/DownloadXLSX"
import DownloadZIP from "src/forms/components/DownloadZIP"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import TaskLayout from "src/core/layouts/TaskLayout"
import { processMetadata } from "src/forms/utils/processMetadata"
import { metadataTable } from "src/forms/utils/metadataTable"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

const MetadataContent = () => {
  // Ensure that only PM can edit a task
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  // Get tasks
  const { task, projectMembers } = useTaskContext()

  // Prepare data for the metadatatable
  const processedMetadata = processMetadata(projectMembers)

  // Create table definitions based on the schema
  const metadataTableColumns = metadataTable(task.formVersion?.schema)

  return (
    <>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        {/* Header */}
        <h1 className="flex justify-center items-center gap-2 text-3xl">
          Review Responses: <span className="italic">{task.name}</span>
          <InformationCircleIcon
            className="h-5 w-5 stroke-2 text-info"
            data-tooltip-id="form-select-tooltip"
          />
          <Tooltip
            id="form-select-tooltip"
            content="This page allows you to review the metadata associated with a specific form. You can use the buttons to review the required information, edit responses, or download the data in JSON and Excel formats."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <div className="flex flex-row m-4 justify-center">
          <JsonFormModal
            schema={getJsonSchema(task.formVersion?.schema)}
            uiSchema={task.formVersion?.uiSchema || {}}
            label="Required Form"
            classNames="btn-primary"
            submittable={false}
          />

          <Link
            className="btn btn-secondary mx-2"
            href={Routes.TaskLogsPage({
              projectId: task.projectId,
              taskId: task.id,
            })}
          >
            Edit Responses
          </Link>
          <Link
            className="btn btn-success mr-2"
            href={Routes.ShowTaskPage({
              projectId: task.projectId,
              taskId: task.id,
            })}
          >
            Go to Task
          </Link>

          <DownloadJSON data={processedMetadata} fileName={task.name} className="btn btn-info" />
          <DownloadXLSX
            data={processedMetadata}
            fileName={task.name}
            className="btn btn-accent mx-2"
          />
          <DownloadZIP data={processedMetadata} fileName={task.name} className="btn btn-info" />
        </div>
        {/* List of form responses */}
        <div className="flex flex-row justify-center">
          <div className="card bg-base-300 w-full">
            <div className="card-body overflow-x-auto">
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
    // @ts-expect-error children are clearly passed below
    <Layout title="Form Data Page">
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

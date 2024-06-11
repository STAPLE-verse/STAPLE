// imports
import { TaskProvider, TaskContext } from "src/Tasks/components/TaskContext"
import { Suspense, useContext } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProject from "src/projects/queries/getProject"
import Table from "src/core/components/Table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DownloadJSON from "src/forms/components/DownloadJSON"
import DownloadXLSX from "src/forms/components/DownloadXLSX"

const TaskContent = () => {
  const taskContext = useContext(TaskContext)
  const { task } = taskContext
  const projectId = useParam("projectId", "number")
  const taskId = useParam("taskId", "number")
  if (!task) {
    return <div>Loading...</div>
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
      changedAt: meta.changedAt,
      ...meta.metadata,
    }
  })

  console.log(dataForm)

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
        accessorKey: "changedAt",
        id: "changedAt",
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
                <Link className="btn btn-primary mx-2" href={Routes.ForgotPasswordPage()}>
                  Form Requirements
                </Link>

                <Link
                  className="btn btn-secondary mx-2"
                  href={Routes.AssignmentsPage({
                    projectId: projectId,
                    taskId: taskId,
                  })}
                >
                  Review and Edit Form Tasks
                </Link>

                <DownloadJSON data={dataForm} fileName={task.name} className="btn btn-info mx-2" />

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
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const taskId = useParam("taskId", "number")

  // return the page
  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
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

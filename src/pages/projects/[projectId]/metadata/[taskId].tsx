// imports
import { TaskProvider, TaskContext } from "src/Tasks/components/TaskContext"
import { Suspense, useContext } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProject from "src/projects/queries/getProject"
import FormDisplay from "src/forms/components/FormDisplay"
import Table from "src/core/components/Table"

const TaskContent = () => {
  const taskContext = useContext(TaskContext)
  const { task } = taskContext
  if (!task) {
    return <div>Loading...</div>
  }

  const statusLogs = task.assignees.flatMap((people) => people.statusLogs)
  const printForm = statusLogs.filter((complete) => {
    return complete.status == "COMPLETED"
  })
  const dataForm = printForm.flatMap((meta, idx, arr) => ({
    id: arr[idx].id,
    ...meta.metadata,
  }))

  const getHeadings = () => {
    return Object.keys(dataForm[0])
  }

  //console.log(dataForm)

  return (
    <>
      <Head>
        <title>Form Data for {task.name}</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <div className="flex flex-row justify-center">
          <div className="card bg-base-300 w-full">
            <div className="card-body">
              <div className="card-title">Form Data for {task.name}</div>
              <FormDisplay theadData={getHeadings()} tbodyData={dataForm} />
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

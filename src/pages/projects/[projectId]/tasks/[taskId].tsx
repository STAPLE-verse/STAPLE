// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// can't figure this one out

// imports
import { TaskSummary } from "src/tasks/components/TaskSummary"
import { Suspense, useContext } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import getTask from "src/tasks/queries/getTask"
import deleteTask from "src/tasks/mutations/deleteTask"
import JsonForm from "src/assignments/components/JsonForm"

import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import Modal from "src/core/components/Modal"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/contributors/queries/getContributor"
import { ContributorPrivileges } from "@prisma/client"
import { TaskInformation } from "src/tasks/components/TaskInformation"
import { AssignmentCompletion } from "src/assignments/components/AssignmentCompletion"
import { TaskProvider, TaskContext } from "src/tasks/components/TaskContext"

export const ShowTaskPage = () => {
  // Setup
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)
  // Get values
  const currentUser = useCurrentUser()
  const taskId = useParam("taskId", "number")
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })
  const projectId = useParam("projectId", "number")

  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  if (!task) {
    return <div>Loading...</div>
  }
  // return (
  //   {!!task && <></>}
  // )
  return (
    <>
      <Head>
        <title>Task {task.name}</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <div className="flex flex-row justify-center m-2">
          <TaskInformation />
          <AssignmentCompletion />
        </div>
        {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && <TaskSummary />}
      </main>
    </>
  )
}

// show the task page
export const ShowTaskPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)

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

ShowTaskPage.authenticate = true

export default ShowTaskPage

// imports
import { TaskSummary } from "src/tasks/components/TaskSummary"
import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import { ContributorPrivileges } from "@prisma/client"
import { TaskInformation } from "src/tasks/components/TaskInformation"
import { AssignmentCompletion } from "src/assignments/components/AssignmentCompletion"
import { TaskProvider, useTaskContext } from "src/tasks/components/TaskContext"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"

const TaskContent = () => {
  const { task } = useTaskContext()
  const { privilege } = useContributorPrivilege()

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
        {privilege == ContributorPrivileges.PROJECT_MANAGER && (
          <TaskSummary taskId={task.id} projectId={task.projectId} />
        )}
      </main>
    </>
  )
}

// Show the task page
export const ShowTaskPage = () => {
  const taskId = useParam("taskId", "number")

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskProvider taskId={taskId!}>
          <TaskContent />
        </TaskProvider>
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage

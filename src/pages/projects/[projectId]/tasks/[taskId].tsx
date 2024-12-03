import { TaskSummary } from "src/tasks/components/TaskSummary"
import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { MemberPrivileges } from "@prisma/client"
import { TaskInformation } from "src/tasks/components/TaskInformation"
import { TaskLogCompletion } from "src/tasklogs/components/TaskLogCompletion"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import TaskLayout from "src/core/layouts/TaskLayout"

const TaskContent = () => {
  const { task } = useTaskContext()
  const { privilege } = useMemberPrivileges()

  return (
    <>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <div className="flex flex-row justify-center m-2">
          <TaskInformation />
          <TaskLogCompletion />
        </div>
        {privilege == MemberPrivileges.PROJECT_MANAGER && (
          <TaskSummary taskId={task.id} projectId={task.projectId} />
        )}
      </main>
    </>
  )
}

// Show the task page
export const ShowTaskPage = () => (
  <Layout title="Task Page">
    <TaskLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskContent />
      </Suspense>
    </TaskLayout>
  </Layout>
)

ShowTaskPage.authenticate = true

export default ShowTaskPage

import { TaskSummary } from "src/tasks/components/TaskSummary"
import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { MemberPrivileges } from "@prisma/client"
import { TaskInformation } from "src/tasks/components/TaskInformation"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import TaskLayout from "src/core/layouts/TaskLayout"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import ICSDownloadButton from "src/core/components/IcsDownload"
import Link from "next/link"
import DeleteTask from "src/tasks/components/DeleteTask"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const TaskContent = () => {
  const { task } = useTaskContext()
  const { privilege } = useMemberPrivileges()
  const currentUser = useCurrentUser()

  return (
    <>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h2 className="text-3xl justify-center mb-2 flex items-center">
          Task:
          <span className="ml-1 italic">
            {task.name.length > 50 ? task.name.slice(0, 50) + "…" : task.name}
          </span>
          <InformationCircleIcon
            className="ml-2 h-5 w-5 stroke-2 text-info"
            data-tooltip-id="task-tooltip"
          />
          <Tooltip
            id="task-tooltip"
            content={
              privilege === MemberPrivileges.PROJECT_MANAGER
                ? "Use this page to complete your tasks, review overall task progress, and update the task."
                : "Use this page to complete your tasks and leave comments for the project manager."
            }
            className="z-[1099] ourtooltips"
          />
        </h2>

        <div className="flex justify-center items-center mt-2 mb-2 gap-2">
          <ICSDownloadButton task={task} />
          {privilege == MemberPrivileges.PROJECT_MANAGER && (
            <>
              <Link
                className="btn btn-secondary"
                href={Routes.EditTaskPage({ projectId: task.projectId, taskId: task.id })}
              >
                Edit Task
              </Link>

              {task.formVersion ? (
                <JsonFormModal
                  schema={getJsonSchema(task.formVersion.schema)}
                  uiSchema={task.formVersion.uiSchema}
                  label="Required Form"
                  classNames="btn-info"
                  submittable={false} // Ensures the form is not submittable
                />
              ) : (
                <></>
              )}

              <Link
                className="btn btn-accent"
                href={Routes.ShowMetadataPage({
                  projectId: task.projectId,
                  taskId: task.id,
                })}
              >
                Go to Download
              </Link>

              <DeleteTask taskId={task.id} projectId={task.projectId} />
            </>
          )}
        </div>

        <div className="flex flex-row justify-center mt-2">
          <TaskInformation />
        </div>

        {privilege === MemberPrivileges.PROJECT_MANAGER ? (
          <TaskSummary />
        ) : (
          <TaskSummary contributorFilter={currentUser?.id} />
        )}
      </main>
    </>
  )
}

// Show the task page
export const ShowTaskPage = () => (
  // @ts-expect-error children are clearly passed below
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

import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { FormTaskSchema } from "src/tasks/schemas"
import createTask from "src/tasks/mutations/createTask"
import { TaskForm } from "src/tasks/components/TaskForm"
import { FORM_ERROR } from "final-form"
import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import toast from "react-hot-toast"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

const NewTaskPage = () => {
  const router = useRouter()
  const [createTaskMutation] = useMutation(createTask)

  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  const handleNewTask = async (values) => {
    try {
      const task = await createTaskMutation({
        ...values,
        projectId: projectId!,
        createdById: currentContributor!.id,
      })

      await toast.promise(Promise.resolve(task), {
        loading: "Creating task...",
        success: "Task created!",
        error: "Failed to create the task...",
      })

      await router.push(Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id }))
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Create New Task">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center mb-2 text-3xl">
          Create New Task
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="project-overview"
          />
          <Tooltip
            id="project-overview"
            content="This page creates a new task in which you can assign people or teams and then also assign them to complete a metadata form for parts of your project. You can add due dates, roles, and tags to help you organize."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            className="flex flex-col"
            projectId={projectId}
            submitText="Create Task"
            schema={FormTaskSchema}
            onSubmit={handleNewTask}
            onCancel={() => router.push(Routes.TasksPage({ projectId: projectId! }))}
            cancelText="Cancel"
          />
        </Suspense>
      </main>
    </Layout>
  )
}

NewTaskPage.authenticate = true

export default NewTaskPage

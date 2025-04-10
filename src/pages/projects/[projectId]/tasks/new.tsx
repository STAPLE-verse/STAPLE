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
import PageHeader from "src/core/components/PageHeader"

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
        <PageHeader title="Create New Task" />
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            className="flex flex-col"
            projectId={projectId}
            submitText="Create Task"
            schema={FormTaskSchema}
            onSubmit={handleNewTask}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

NewTaskPage.authenticate = true

export default NewTaskPage

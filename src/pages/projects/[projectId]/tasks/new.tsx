import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { FormTaskSchema } from "src/tasks/schemas"
import createTask from "src/tasks/mutations/createTask"
import { TaskForm, FORM_ERROR } from "src/tasks/components/TaskForm"
import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import Head from "next/head"
import toast from "react-hot-toast"
import getContributor from "src/contributors/queries/getContributor"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

const NewTaskPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createTaskMutation] = useMutation(createTask)
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  const initialValues = {
    // Making sure that conributorsId always returns an empty array even if it is not touched
    contributorsId: [],
  }

  return (
    <Layout>
      <Head>
        <title>Create New Task</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl">Create New Task</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            className="flex flex-col"
            projectId={projectId}
            submitText="Create Task"
            schema={FormTaskSchema}
            // TODO: if I add initial values there is a lag in task creation
            // initialValues={initialValues}
            onSubmit={async (values) => {
              // Create new task
              try {
                // if (true) return
                const task = await createTaskMutation({
                  name: values.name,
                  description: values.description,
                  columnId: values.columnId,
                  projectId: projectId!,
                  deadline: values.deadline,
                  elementId: values.elementId,
                  createdById: currentContributor.id,
                  contributorsId: values.contributorsId,
                  teamsId: values.teamsId,
                  schema: values.schema?.schema,
                  ui: values.schema?.ui,
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
            }}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

NewTaskPage.authenticate = true

export default NewTaskPage

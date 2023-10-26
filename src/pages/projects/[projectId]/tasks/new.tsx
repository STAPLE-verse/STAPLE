import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { FormTaskSchema } from "src/tasks/schemas"
import createTask from "src/tasks/mutations/createTask"
import { TaskForm, FORM_ERROR } from "src/tasks/components/TaskForm"
import { Suspense } from "react"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import Layout from "src/core/layouts/Layout"
import Head from "next/head"

const NewTaskPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createTaskMutation] = useMutation(createTask)

  return (
    <>
      <Head>
        <title>Create New Task</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Create New Task</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <TaskForm
            className="flex flex-col"
            projectId={projectId}
            submitText="Create Task"
            schema={FormTaskSchema}
            // initialValues={{ name: "", description: "" }}
            onSubmit={async (values) => {
              try {
                const task = await createTaskMutation({
                  name: values.name,
                  description: values.description,
                  columnId: values.columnId,
                  projectId: projectId!,
                  elementId: values.elementId,
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
    </>
  )
}

NewTaskPage.authenticate = true
NewTaskPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default NewTaskPage

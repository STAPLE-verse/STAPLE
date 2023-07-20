import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { CreateTaskSchema } from "src/tasks/schemas"
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
  console.log(projectId)
  return (
    <>
      <Head>
        <title>Create New Task</title>
      </Head>
      <h1>Create New Task</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TaskForm
          submitText="Create Task"
          schema={CreateTaskSchema}
          // initialValues={{ name: "", description: "" }}
          onSubmit={async (values) => {
            console.log("btn pushed")
            try {
              const task = await createTaskMutation({
                ...values,
                projectId: projectId!,
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

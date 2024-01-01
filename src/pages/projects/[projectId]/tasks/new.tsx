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
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import getProject from "src/projects/queries/getProject"

const NewTaskPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const [createTaskMutation] = useMutation(createTask)

  const sidebarItems = ProjectSidebarItems(projectId!, null)

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
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
                  contributorId: values.contributorId,
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

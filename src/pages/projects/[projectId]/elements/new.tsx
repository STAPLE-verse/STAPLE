import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import Layout from "src/core/layouts/Layout"
import { CreateElementSchema } from "src/elements/schemas"
import createElement from "src/elements/mutations/createElement"
import { ElementForm, FORM_ERROR } from "src/elements/components/ElementForm"
import { Suspense } from "react"
import { useParam } from "@blitzjs/next"

const NewElementPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createElementMutation] = useMutation(createElement)

  return (
    <>
      <Head>
        <title>Create New Element</title>
      </Head>
      <h1>Create New Element</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ElementForm
          submitText="Create Element"
          schema={CreateElementSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const element = await createElementMutation({ ...values, projectId: projectId! })
              await router.push(
                Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })
              )
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

NewElementPage.authenticate = true
NewElementPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default NewElementPage

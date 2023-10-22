import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { CreateContributorSchema } from "src/contributors/schemas"
import createContributor from "src/contributors/mutations/createContributor"
import { ContributorForm, FORM_ERROR } from "src/contributors/components/ContributorForm"
import { Suspense } from "react"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import Head from "next/head"

const NewContributorPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createContributorMutation] = useMutation(createContributor)

  return (
    <>
      <Head>
        <title>Add New Contributor</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Add New Contributor</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ContributorForm
            className="flex flex-col"
            submitText="Add Contributor"
            schema={CreateContributorSchema}
            // initialValues={{}}
            onSubmit={async (values) => {
              try {
                const contributor = await createContributorMutation({
                  userId: values.userId,
                  projectId: projectId!,
                })
                await router.push(
                  Routes.ShowContributorPage({
                    projectId: projectId!,
                    contributorId: contributor.id,
                  })
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
      </main>
    </>
  )
}

NewContributorPage.authenticate = true
NewContributorPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default NewContributorPage

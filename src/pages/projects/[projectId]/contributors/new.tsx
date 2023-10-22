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

const NewContributorPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createContributorMutation] = useMutation(createContributor)

  return (
    <Layout title={"Create New Contributor"}>
      <h1>Create New Contributor</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorForm
          submitText="Create Contributor"
          schema={CreateContributorSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const contributor = await createContributorMutation({
                ...values,
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
      <p>
        <Link href={Routes.ContributorsPage({ projectId: projectId! })}>Contributors</Link>
      </p>
    </Layout>
  )
}

NewContributorPage.authenticate = true

export default NewContributorPage

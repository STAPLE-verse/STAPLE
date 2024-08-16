import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import createContributor from "src/contributors/mutations/createContributor"
import { ContributorForm } from "src/contributors/components/ContributorForm"
import { FORM_ERROR } from "final-form"
import { Suspense } from "react"
import Head from "next/head"
import toast from "react-hot-toast"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "db"
import { CreateContributorFormSchema } from "src/contributors/schemas"

const NewContributor = () => {
  const [createContributorMutation] = useMutation(createContributor)
  const router = useRouter()

  const projectId = useParam("projectId", "number")

  const currentUser = useCurrentUser()

  // Handle events
  const handleSubmit = async (values) => {
    try {
      const contributor = await createContributorMutation({
        userId: values.userId,
        projectId: projectId!,
        privilege: values.privilege,
        addedBy: currentUser!.username,
        labelsId: values.labelsId,
      })
      await toast.promise(Promise.resolve(contributor), {
        loading: "Adding contributor...",
        success: "Contributor added to the project!",
        error: "Failed to add the contributor...",
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
  }

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
      <h1 className="text-3xl">Add New Contributor</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorForm
          projectId={projectId!}
          className="flex flex-col"
          submitText="Add Contributor"
          schema={CreateContributorFormSchema}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </main>
  )
}

const NewContributorPage = () => {
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Add New Contributor</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <NewContributor />
      </Suspense>
    </Layout>
  )
}

NewContributorPage.authenticate = true

export default NewContributorPage

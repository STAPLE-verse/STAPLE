import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import toast from "react-hot-toast"
import Layout from "src/core/layouts/Layout"
import { UpdateContributorFormSchema } from "src/contributors/schemas"
import getContributor from "src/contributors/queries/getContributor"
import updateContributor from "src/contributors/mutations/updateContributor"
import { ContributorForm } from "src/contributors/components/ContributorForm"
import { FORM_ERROR } from "final-form"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "@prisma/client"
import { getContributorName } from "src/services/getName"

export const EditContributor = () => {
  const [updateContributorMutation] = useMutation(updateContributor)
  const router = useRouter()

  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const [contributor, { setQueryData }] = useQuery(getContributor, {
    where: { id: contributorId, project: { id: projectId! } },
    include: {
      labels: {
        select: {
          name: true,
          id: true,
        },
      },
      user: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
  })

  const labelsId =
    contributor["labels"] != undefined ? contributor["labels"].map((label) => label.id) : []
  // Set initial values
  const initialValues = {
    privilege: contributor.privilege,
    labelsId: labelsId,
  }

  // Handle events
  const handleCancel = async () => {
    await router.push(
      Routes.ShowContributorPage({
        projectId: projectId!,
        contributorId: contributorId as number,
      })
    )
  }

  const handleSubmit = async (values) => {
    try {
      const updated = await updateContributorMutation({
        id: contributor.id,
        projectId: projectId!,
        privilege: values.privilege,
        labelsId: values.labelsId,
      })
      await toast.promise(Promise.resolve(updated), {
        loading: "Updating contributor information...",
        success: "Contributor information updated!",
        error: "Failed to update the contributor information...",
      })
      await setQueryData(updated)
      await router.push(
        Routes.ShowContributorPage({
          projectId: projectId!,
          contributorId: updated.id,
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
      <h1 className="text-3xl mb-2">Edit Contributor {getContributorName(contributor)}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorForm
          submitText="Update Contributor"
          projectId={projectId as number}
          isEdit={true}
          schema={UpdateContributorFormSchema}
          initialValues={initialValues}
          cancelText="Cancel"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </main>
  )
}

const EditContributorPage = () => {
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Edit Contributor</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <EditContributor />
      </Suspense>
    </Layout>
  )
}

EditContributorPage.authenticate = true

export default EditContributorPage

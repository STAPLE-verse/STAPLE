import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import getUsers from "src/users/queries/getUsers"
import toast from "react-hot-toast"

import Layout from "src/core/layouts/Layout"
import { UpdateContributorSchema } from "src/contributors/schemas"
import getContributor from "src/contributors/queries/getContributor"
import updateContributor from "src/contributors/mutations/updateContributor"
import { ContributorFormEdit } from "src/contributors/components/ContributorForm"
import { FORM_ERROR } from "final-form"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "@prisma/client"

export const EditContributor = () => {
  const router = useRouter()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")
  const [contributor, { setQueryData }] = useQuery(getContributor, {
    where: { id: contributorId, project: { id: projectId! } },
  })
  const [updateContributorMutation] = useMutation(updateContributor)

  const [user] = useQuery(getUsers, {
    where: { id: contributor.userId },
    take: 1,
  })

  return (
    <Layout>
      <Head>
        <title>Edit Contributor {user[0]?.username} </title>
      </Head>

      <div>
        <h1 className="text-3xl mb-2">
          Edit Contributor{" "}
          {user[0]?.firstName || user[0]?.lastName
            ? `${user[0].firstName} ${user[0].lastName}`
            : user[0]?.username}
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ContributorFormEdit
            projectId={projectId as number}
            cancelText="Cancel"
            onCancel={() =>
              router.push(
                Routes.ShowContributorPage({
                  projectId: projectId!,
                  contributorId: contributorId as number,
                })
              )
            }
            submitText="Update Contributor"
            schema={UpdateContributorSchema}
            initialValues={contributor}
            onSubmit={async (values) => {
              try {
                const updated = await updateContributorMutation({
                  // id: contributor.id,
                  // projectId: projectId,
                  ...values,
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
            }}
          />
        </Suspense>
      </div>
    </Layout>
  )
}

const EditContributorPage = () => {
  const projectId = useParam("projectId", "number")
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <EditContributor />
      </Suspense>

      <p>
        <Link href={Routes.ContributorsPage({ projectId: projectId! })}>Contributors</Link>
      </p>
    </>
  )
}

EditContributorPage.authenticate = true

export default EditContributorPage

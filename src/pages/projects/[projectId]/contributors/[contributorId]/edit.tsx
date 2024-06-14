// @ts-nocheck
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
import { ContributorFormEdit, FORM_ERROR } from "src/contributors/components/ContributorFormEdit"

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

  console.log(contributor)

  return (
    <Layout>
      <Head>
        <title>Edit Contributor {user[0].username} </title>
      </Head>

      <div>
        <h1 className="text-3xl">
          Edit Contributor{" "}
          {user[0].firstName || user[0].lastName
            ? `${user[0].firstName} ${user[0].lastName}`
            : user[0].username}
        </h1>
        <pre>{JSON.stringify(contributor, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <ContributorFormEdit
            submitText="Update Contributor"
            schema={UpdateContributorSchema}
            initialValues={contributor}
            onSubmit={async (values) => {
              try {
                const updated = await updateContributorMutation({
                  id: contributor.id,
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

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditContributor />
      </Suspense>

      <p>
        <Link href={Routes.ContributorsPage({ projectId: projectId! })}>Contributors</Link>
      </p>
    </div>
  )
}

EditContributorPage.authenticate = true

export default EditContributorPage

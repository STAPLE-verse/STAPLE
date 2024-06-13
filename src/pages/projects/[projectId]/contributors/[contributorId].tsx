import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getContributor from "src/contributors/queries/getContributor"
import deleteContributor from "src/contributors/mutations/deleteContributor"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { Contributor, User } from "@prisma/client"
import { getPrivilegeText } from "src/services/getPrivilegeText"

export const ContributorPage = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteContributorMutation] = useMutation(deleteContributor)
  const contributor = useQuery(getContributor, {
    where: { id: contributorId },
    include: { user: true },
  }) as unknown as Contributor & {
    user: User
  }

  const user = contributor[0].user

  return (
    <Layout>
      <Head>
        <title>{user.username}</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl">
          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
        </h1>
        {user.firstName && user.lastName ? (
          <p className="mb-2">
            <span className="font-semibold">Username:</span> {user.username}
          </p>
        ) : null}
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Privilege:</span>{" "}
          {getPrivilegeText(contributor[0].privilege)}
        </p>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl">Contribution Labels</h2>
          {/* Add list of tasks for the contributor in this specific project */}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl">Contribution Task</h2>
          {/* Add list of tasks for the contributor in this specific project */}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={async () => {
              if (
                window.confirm(
                  "This contributor will be removed from the project. Are you sure to continue?"
                )
              ) {
                await deleteContributorMutation({ id: contributor[0].id })
                // Check if User removed themselves and return to main page
                // TODO: This my lead to an error if contributorspage is loaded too soon
                if (user.id === currentUser?.id) {
                  await router.push(Routes.ProjectsPage())
                } else {
                  await router.push(Routes.ContributorsPage({ projectId: projectId! }))
                }
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Delete Contributor
          </button>
        </div>
      </main>
    </Layout>
  )
}

const ShowContributorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContributorPage />
    </Suspense>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage

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
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

export const Contributor = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const [deleteContributorMutation] = useMutation(deleteContributor)
  const [contributor] = useQuery(getContributor, { id: contributorId })
  const user = contributor.user

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>{user.username}</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1>
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
        <div className="flex flex-col gap-2">
          <h2>List of contributions</h2>
          {/* Add list of tasks for the contributor in this specific project */}
        </div>

        {/* TODO: Do we need an edit contributor information section? Or the affiliations etc will be collected as metadata anyways? */}
        {/* <div className="flex justify-start mt-4">
          <Link
            className="btn"
            href={Routes.EditContributorPage({
              projectId: projectId!,
              contributorId: contributor.id,
            })}
          >
            Edit
          </Link>
        </div> */}

        <div className="flex justify-end mt-4">
          <button
            className="btn"
            type="button"
            onClick={async () => {
              if (
                window.confirm(
                  "This contributor will be removed from the project. Are you sure to continue?"
                )
              ) {
                await deleteContributorMutation({ id: contributor.id })
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
            Remove
          </button>
        </div>
      </main>
    </Layout>
  )
}

const ShowContributorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contributor />
    </Suspense>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage
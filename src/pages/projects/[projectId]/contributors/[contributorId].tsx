import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getContributor from "src/contributors/queries/getContributor"
import deleteContributor from "src/contributors/mutations/deleteContributor"

export const Contributor = () => {
  const router = useRouter()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteContributorMutation] = useMutation(deleteContributor)
  const [contributor] = useQuery(getContributor, { id: contributorId })

  return (
    <>
      <Head>
        <title>Contributor {contributor.id}</title>
      </Head>

      <div>
        <h1>Contributor {contributor.id}</h1>
        <pre>{JSON.stringify(contributor, null, 2)}</pre>

        <Link
          href={Routes.EditContributorPage({
            projectId: projectId!,
            contributorId: contributor.id,
          })}
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteContributorMutation({ id: contributor.id })
              await router.push(Routes.ContributorsPage({ projectId: projectId! }))
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowContributorPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <p>
        <Link href={Routes.ContributorsPage({ projectId: projectId! })}>Contributors</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Contributor />
      </Suspense>
    </div>
  )
}

ShowContributorPage.authenticate = true
ShowContributorPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowContributorPage

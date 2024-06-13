import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTeam from "src/teams/queries/getTeam"
import deleteTeam from "src/teams/mutations/deleteTeam"
import getContributors from "src/contributors/queries/getContributors"
import { getInitials } from "src/services/getInitials"
import { ContributorLabelsList } from "src/labels/components/ContributorsLabelsList"
import { ContributorTaskList } from "src/tasks/components/ContributorsTaskList"

export const ShowTeamPage = () => {
  const router = useRouter()
  const [deleteTeamMutation] = useMutation(deleteTeam)

  const teamId = useParam("teamId", "number")
  const [team] = useQuery(getTeam, { id: teamId })

  const [{ contributors }] = useQuery(getContributors, {
    where: { teams: { some: { id: teamId } } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const projectId = useParam("projectId", "number")

  const membersId = contributors.map((contributor) => contributor.userId)

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Team {team.name}</title>
        </Head>

        <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
          <div className="flex mt-4">
            <h1 className="text-3xl">Team: {team.name}</h1>
          </div>
          <div className="flex mt-4 text-2xl">Members: </div>

          {/* TODO refactor this to a global compoenent to show contributors , also used in contributor page */}
          <div className="mt-4">
            {contributors.map((contributor) => {
              const firstName = contributor["user"].firstName
              const lastName = contributor["user"].lastName
              const username = contributor["user"].username
              const initial = getInitials(firstName, lastName)

              return (
                <div className="card bg-base-300 mb-2" key={contributor.id}>
                  <div className="card-body flex flex-row justify-between">
                    <div className="flex items-center">
                      <div className="avatar placeholder">
                        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                          <span className="text-1xl">{initial ? initial : "?"}</span>
                        </div>
                      </div>
                      <div className="text-2xl ml-4">
                        <p>{firstName || lastName ? `${firstName} ${lastName}` : username}</p>
                      </div>
                    </div>
                    <div className="justify-end">
                      <Link
                        className="btn btn-primary"
                        href={Routes.ShowContributorPage({
                          projectId: projectId!,
                          contributorId: contributor.id,
                        })}
                      >
                        See contributions
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Team members contribution labels</h2>
            <ContributorLabelsList usersId={membersId}></ContributorLabelsList>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Team members contribution Tasks</h2>

            <ContributorTaskList usersId={membersId}></ContributorTaskList>
          </div>

          <div className="flex justify-start mt-4">
            <Link
              className="btn btn-primary"
              href={Routes.EditTeamPage({ projectId: projectId!, teamId: team.id })}
            >
              Update Team
            </Link>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                if (
                  window.confirm("The team will be permanently deleted. Are you sure to continue?")
                ) {
                  await deleteTeamMutation({ id: team.id })
                  await router.push(Routes.TeamsPage({ projectId: projectId! }))
                }
              }}
            >
              Delete Team
            </button>
          </div>
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTeamPage.authenticate = true

export default ShowTeamPage

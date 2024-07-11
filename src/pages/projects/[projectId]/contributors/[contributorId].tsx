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

import { ContributorTaskListDone } from "src/tasks/components/ContributorsTaskListDone"
import { ContributorLabelsList } from "src/labels/components/ContributorsLabelsList"
import { labelTableColumnsSimple } from "src/labels/components/LabelTable"
import { taskFinishedTableColumns } from "src/tasks/components/TaskTable"
import Link from "next/link"
import { ContributorPrivileges } from "db"
import toast from "react-hot-toast"
import ContributorAuthorization from "src/contributors/components/ContributorAuthorization"

export const ContributorPage = () => {
  const router = useRouter()
  const [deleteContributorMutation] = useMutation(deleteContributor)

  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const currentUser = useCurrentUser()
  const contributor = useQuery(getContributor, {
    where: { id: contributorId },
    include: { user: true },
  }) as unknown as Contributor & {
    user: User
  }

  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
    include: { teams: true },
  })

  const user = contributor[0].user
  const teams = currentContributor.hasOwnProperty("teams")
    ? currentContributor["teams"].map((team) => team.name)
    : ""

  const handleDelete = async () => {
    if (
      window.confirm("This contributor will be removed from the project. Are you sure to continue?")
    ) {
      try {
        await deleteContributorMutation({ id: contributor[0].id })
        // Check if User removed themselves and return to main page
        if (user.id === currentUser?.id) {
          await router.push(Routes.ProjectsPage())
        } else {
          await router.push(Routes.ContributorsPage({ projectId: projectId! }))
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <Layout>
      <Head>
        <title>{user.username} Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <div className="card bg-base-300 w-full">
          <div className="card-body">
            <div className="card-title">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </div>
            {user.firstName && user.lastName ? (
              <p>
                <span className="font-semibold">Username:</span> {user.username}
              </p>
            ) : null}
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Privilege:</span>{" "}
              {getPrivilegeText(contributor[0].privilege)}
            </p>

            <p>
              <span className="font-semibold">Team Membership:</span> {teams.join(", ")}
            </p>

            <div className="card-actions justify-end">
              {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER ? (
                <Link
                  className="btn btn-primary"
                  href={Routes.EditContributorPage({
                    projectId: projectId!,
                    contributorId: contributorId!,
                  })}
                >
                  Edit Contributor
                </Link>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-300 w-full mt-2">
          <div className="card-body">
            <div className="card-title">Contribution Labels</div>
            <ContributorLabelsList
              usersId={[user?.id]}
              projectId={projectId}
              columns={labelTableColumnsSimple}
            ></ContributorLabelsList>
            <div className="card-actions justify-end">
              <Link className="btn btn-primary" href={Routes.CreditPage({ projectId: projectId! })}>
                Edit Labels
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-300 w-full mt-2">
          <div className="card-body">
            <div className="card-title">Contribution Tasks</div>
            <ContributorTaskListDone
              contributor={currentContributor}
              columns={taskFinishedTableColumns}
            ></ContributorTaskListDone>
            <div className="card-actions justify-end">
              <Link className="btn btn-primary" href={Routes.CreditPage({ projectId: projectId! })}>
                Edit Labels
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleDelete}
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
    <ContributorAuthorization requiredPrivileges={["PROJECT_MANAGER"]}>
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorPage />
      </Suspense>
    </ContributorAuthorization>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage

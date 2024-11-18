import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import toast from "react-hot-toast"
import Layout from "src/core/layouts/Layout"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import updateProjectMember from "src/projectmembers/mutations/updateProjectMember"
import { ContributorForm } from "src/contributors/components/ContributorForm"
import { FORM_ERROR } from "final-form"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "@prisma/client"
import { getContributorName } from "src/core/utils/getName"
import addProjectManagerWidgets from "src/widgets/mutations/addProjectManagerWidgets"
import removeProjectManagerWidgets from "src/widgets/mutations/removeProjectManagerWidgets"
import getProjectPrivilege from "src/projectprivileges/queries/getProjectPrivilege"
import { UpdateProjectMemberFormSchema } from "src/projectmembers/schemas"
import { ProjectMemberWithUsersAndRoles } from "src/core/types"
import DeleteContributor from "src/contributors/components/DeleteContributor"
import PageHeader from "src/core/components/PageHeader"

export const EditContributor = () => {
  const [updateProjectMemberMutation] = useMutation(updateProjectMember)
  const [addProjectManagerWidgetsMutation] = useMutation(addProjectManagerWidgets)
  const [removeProjectManagerWidgetsMutation] = useMutation(removeProjectManagerWidgets)
  const router = useRouter()

  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const [fetchedContributor, { refetch }] = useQuery(getProjectMember, {
    where: { id: contributorId, project: { id: projectId! } },
    include: {
      roles: {
        select: {
          name: true,
          id: true,
        },
      },
      users: true,
    },
  })

  const contributor = fetchedContributor as ProjectMemberWithUsersAndRoles

  const contributorUser = contributor.users[0]

  const [contributorPrivilege] = useQuery(getProjectPrivilege, {
    where: { userId: contributorUser!.id, projectId: projectId },
  })

  const rolesId = contributor.roles != undefined ? contributor.roles.map((role) => role.id) : []

  // Set initial values
  const initialValues = {
    privilege: contributorPrivilege.privilege,
    rolesId: rolesId,
  }

  // Handle events
  const handleCancel = async () => {
    await router.push(
      Routes.ShowContributorPage({
        projectId: projectId!,
        contributorId: contributorId!,
      })
    )
  }

  const handleSubmit = async (values) => {
    try {
      const updated = await updateProjectMemberMutation({
        id: contributor.id,
        projectId: projectId!,
        userId: contributorUser!.id,
        privilege: values.privilege,
        rolesId: values.rolesId,
      })

      await toast.promise(Promise.resolve(updated), {
        loading: "Updating contributor information...",
        success: "Contributor information updated!",
        error: "Failed to update the contributor information...",
      })

      await refetch()

      // Check if the privilege has changed
      if (contributorPrivilege.privilege !== values.privilege) {
        // Add or remove widgets based on privilege change
        if (values.privilege === "PROJECT_MANAGER") {
          // Add widgets for project manager
          await addProjectManagerWidgetsMutation({
            userId: contributorUser!.id,
            projectId: projectId!,
          })
        } else if (values.privilege === "CONTRIBUTOR") {
          // Remove widgets exclusive to project manager
          await removeProjectManagerWidgetsMutation({
            userId: contributorUser!.id,
            projectId: projectId!,
          })
        }
      }

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
      <PageHeader className="mb-2" title={`Edit Contributor ${getContributorName(contributor)}`} />
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorForm
          submitText="Update Contributor"
          projectId={projectId!}
          editedUserId={contributorUser!.id}
          isEdit={true}
          schema={UpdateProjectMemberFormSchema}
          initialValues={initialValues}
          cancelText="Cancel"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
        <div className="flex justify-end mt-2">
          <DeleteContributor
            projectId={projectId!}
            contributorUser={contributorUser!}
            contributorId={contributorId!}
          />
        </div>
      </Suspense>
    </main>
  )
}

const EditContributorPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

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

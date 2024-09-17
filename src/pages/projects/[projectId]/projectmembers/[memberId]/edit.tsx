import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import toast from "react-hot-toast"
import Layout from "src/core/layouts/Layout"
import { UpdateProjectMemberFormSchema } from "src/projectMember/schemas"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import updateProjectMember from "src/projectmembers/mutations/updateProjectMember"
import { ProjectMemberForm } from "src/projectmembers/components/ProjectMemberForm"
import { FORM_ERROR } from "final-form"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "@prisma/client"
import { getProjectMemberName } from "src/services/getName"
import addProjectManagerWidgets from "src/widgets/mutations/addProjectManagerWidgets"
import removeProjectManagerWidgets from "src/widgets/mutations/removeProjectManagerWidgets"

export const EditProjectMember = () => {
  const [updateProjectMemberMutation] = useMutation(updateProjectMember)
  const [addProjectManagerWidgetsMutation] = useMutation(addProjectManagerWidgets)
  const [removeProjectManagerWidgetsMutation] = useMutation(removeProjectManagerWidgets)
  const router = useRouter()

  const projectMemberId = useParam("projectMemberId", "number")
  const projectId = useParam("projectId", "number")

  const [projectMember, { setQueryData }] = useQuery(getProjectMember, {
    where: { id: projectMemberId, project: { id: projectId! } },
    include: {
      roles: {
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

  const rolesId =
    projectMember["roles"] != undefined ? projectMember["roles"].map((role) => role.id) : []

  // Set initial values
  const initialValues = {
    privilege: projectMember.privilege,
    rolesId: rolesId,
  }

  // Handle events
  const handleCancel = async () => {
    await router.push(
      Routes.ShowProjectMemberPage({
        projectId: projectId!,
        projectMemberId: projectMemberId as number,
      })
    )
  }

  const handleSubmit = async (values) => {
    try {
      const updated = await updateProjectMemberMutation({
        id: projectMember.id,
        projectId: projectId!,
        privilege: values.privilege,
        rolesId: values.rolesId,
      })

      await toast.promise(Promise.resolve(updated), {
        loading: "Updating contributor information...",
        success: "Contributor information updated!",
        error: "Failed to update the contributor information...",
      })

      // Add or remove widgets based on privilege change
      if (values.privilege === "PROJECT_MANAGER") {
        // Add widgets for project manager
        await addProjectManagerWidgetsMutation({
          userId: projectMember.userId,
          projectId: projectId!,
        })
      } else if (values.privilege === "CONTRIBUTOR") {
        // Remove widgets exclusive to project manager
        await removeProjectManagerWidgetsMutation({
          userId: projectMember.userId,
          projectId: projectId!,
        })
      }

      await setQueryData(updated)

      await router.push(
        Routes.ShowProjectMemberPage({
          projectId: projectId!,
          projectMemberId: updated.id,
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
      <h1 className="text-3xl mb-2">Edit Contributor {getProjectMemberName(projectMember)}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectMemberForm
          submitText="Update Contributor"
          projectId={projectId as number}
          isEdit={true}
          schema={UpdateProjectMemberFormSchema}
          initialValues={initialValues}
          cancelText="Cancel"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </main>
  )
}

const EditProjectMemberPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Edit Contributor</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProjectMember />
      </Suspense>
    </Layout>
  )
}

EditProjectMemberPage.authenticate = true

export default EditProjectMemberPage

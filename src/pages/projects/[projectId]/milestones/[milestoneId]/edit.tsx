import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { FormMilestoneSchema } from "src/milestones/schemas"
import getMilestone from "src/milestones/queries/getMilestone"
import updateMilestone from "src/milestones/mutations/updateMilestone"
import { MilestoneForm } from "src/milestones/components/MilestoneForm"
import { FORM_ERROR } from "final-form"

import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import PageHeader from "src/core/components/PageHeader"

export const EditMilestone = () => {
  const [updateMilestoneMutation] = useMutation(updateMilestone)
  const router = useRouter()
  const milestoneId = useParam("milestoneId", "number")
  const projectId = useParam("projectId", "number")
  const [milestone, { setQueryData }] = useQuery(
    getMilestone,
    { id: milestoneId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  const initialValues = {
    name: milestone.name,
    description: milestone.description,
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Edit Milestone Page">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <PageHeader title={`Edit ${milestone.name}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <MilestoneForm
            submitText="Update Milestone"
            schema={FormMilestoneSchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                const updated = await updateMilestoneMutation({
                  id: milestone.id,
                  ...values,
                })
                await toast.promise(Promise.resolve(updated), {
                  loading: "Updating milestone...",
                  success: "Milestone updated!",
                  error: "Failed to update the milestone...",
                })
                await setQueryData(updated)
                await router.push(
                  Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: updated.id })
                )
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
          <Link
            className="btn btn-secondary self-end mt-4"
            href={Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: milestoneId! })}
          >
            Cancel
          </Link>
        </Suspense>
      </main>
    </Layout>
  )
}

const EditMilestonePage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditMilestone />
    </Suspense>
  )
}

EditMilestonePage.authenticate = true

export default EditMilestonePage

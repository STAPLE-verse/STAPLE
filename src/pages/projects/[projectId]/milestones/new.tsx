import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormMilestoneSchema } from "src/milestones/schemas"
import { MilestoneForm } from "src/milestones/components/MilestoneForm"
import { FORM_ERROR } from "final-form"
import { Suspense } from "react"
import { useParam } from "@blitzjs/next"
import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import PageHeader from "src/core/components/PageHeader"
import createMilestone from "src/milestones/mutations/createMilestone"

const NewMilestonePage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createMilestoneMutation] = useMutation(createMilestone)

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Create New Milestone">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <PageHeader title="Create New Milestone" />
        <Suspense fallback={<div>Loading...</div>}>
          <MilestoneForm
            submitText="Create Milestone"
            schema={FormMilestoneSchema}
            onSubmit={async (values) => {
              try {
                const milestone = await createMilestoneMutation({
                  ...values,
                  projectId: projectId!,
                })
                await toast.promise(Promise.resolve(milestone), {
                  loading: "Creating milestone...",
                  success: "Milestone created!",
                  error: "Failed to create the milestone...",
                })
                await router.push(
                  Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: milestone.id })
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
      </main>
    </Layout>
  )
}

NewMilestonePage.authenticate = true

export default NewMilestonePage

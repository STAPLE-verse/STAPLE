import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import getMilestone from "src/milestones/queries/getMilestone"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { MilestoneInformation } from "src/milestones/components/MilestoneInformation"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { MilestoneSummary } from "src/milestones/components/MilestoneSummary"

const ShowMilestonePage = () => {
  // ProjectMember authentication
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])
  const { privilege } = useMemberPrivileges()

  // Get milestones
  const projectId = useParam("projectId", "number")
  const milestoneId = useParam("milestoneId", "number")
  const [milestone, { refetch }] = useQuery(getMilestone, { id: milestoneId })

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Milestone Page">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <MilestoneInformation
              milestone={milestone}
              projectId={projectId}
              onTasksUpdated={refetch}
            />
            {privilege == MemberPrivileges.PROJECT_MANAGER && (
              <MilestoneSummary milestone={milestone} projectId={projectId} />
            )}
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

ShowMilestonePage.authenticate = true

export default ShowMilestonePage

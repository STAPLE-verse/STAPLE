import { Suspense } from "react"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ProjectDashboard from "src/projects/components/ProjectDashboard"
import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import AnnouncementModal from "src/projects/components/AnnouncementModal"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useProjectWidgets } from "src/projects/hooks/useProjectWidgets"

const ShowProjectContent = () => {
  const { privilege } = useMemberPrivileges()
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const currentUser = useCurrentUser()

  const { widgets, setWidgets, refreshWidgets } = useProjectWidgets({
    userId: currentUser!.id,
    projectId: projectId!,
    privilege: privilege!,
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {privilege == MemberPrivileges.PROJECT_MANAGER && (
        <AnnouncementModal projectId={projectId!} refreshWidgets={refreshWidgets} />
      )}
      <ProjectDashboard widgets={widgets} setWidgets={setWidgets} />
    </main>
  )
}

export const ShowProjectPage = () => {
  return (
    <Layout title="Project page">
      <Suspense fallback={<div>Loading...</div>}>
        <ShowProjectContent />
      </Suspense>
    </Layout>
  )
}

ShowProjectPage.authenticate = true

export default ShowProjectPage

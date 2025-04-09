import { Suspense } from "react"
import Head from "next/head"
import Layout from "src/core/layouts/Layout"
import { ProjectTasksTabs } from "src/tasks/components/ProjectTasksTabs"
import { useParam } from "@blitzjs/next"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"

const TasksPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Tasks">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectTasksTabs projectPrivilege={privilege} projectId={projectId} />
        </Suspense>
      </main>
    </Layout>
  )
}

export default TasksPage

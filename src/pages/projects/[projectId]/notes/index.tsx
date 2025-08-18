import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import dynamic from "next/dynamic"
import { useParam } from "@blitzjs/next"

const NotesPanel = dynamic(() => import("src/notes/components/NotesPanel"), { ssr: false })

const NotesPage = () => {
  // Allow Contributors and PMs to access their own notes
  useProjectMemberAuthorization([MemberPrivileges.CONTRIBUTOR, MemberPrivileges.PROJECT_MANAGER])

  const projectId = useParam("projectId", "number")
  if (!projectId) return null

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Notes">
      <main className="flex flex-col mx-auto w-full">
        <div className="flex justify-center items-center gap-2 mb-2">
          <h1 className="text-3xl">Notes</h1>
          <InformationCircleIcon
            className="h-5 w-5 stroke-2 text-info"
            data-tooltip-id="project-notes-tooltip"
          />
          <Tooltip
            id="project-notes-tooltip"
            content="Create and manage your private project notes. Notes are visible only to you unless sharing is enabled later."
            className="z-[1099] ourtooltips"
          />
        </div>
        {
          <Suspense fallback={<div>Loading...</div>}>
            <NotesPanel projectId={projectId} />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default NotesPage

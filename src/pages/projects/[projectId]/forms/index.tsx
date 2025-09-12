import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { ProjectFormsList } from "src/forms/components/ProjectFormsList"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

const MetadataPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Form Data">
      <main className="flex flex-col mx-auto w-full">
        <div className="flex justify-center items-center gap-2 mb-2">
          <h1 className="text-3xl">Form Data</h1>
          <InformationCircleIcon
            className="h-5 w-5 stroke-2 text-info"
            data-tooltip-id="form-data-tooltip"
          />
          <Tooltip
            id="form-data-tooltip"
            content="View the metadata collected from your collaborators. Click 'Responses' to review entries and download the data in JSON or Excel format."
            className="z-[1099] ourtooltips"
          />
        </div>
        {
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectFormsList />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default MetadataPage

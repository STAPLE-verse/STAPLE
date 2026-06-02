import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import ProjectsList from "src/projects/components/ProjectsList"
import CopyProjectModal from "src/projects/components/CopyProjectModal"
import SearchButton from "src/core/components/SearchButton"
import { InformationCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid"
import { Tooltip } from "react-tooltip"
import { useTranslation } from "react-i18next"

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }
  const { t } = (useTranslation as any)()
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Projects">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center text-3xl">
          {t("projects.title")}
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="project-overview"
          />
          <Tooltip
            id="project-overview"
            content="This page displays all projects. You can create a new project or search for existing projects. Click on a project name to see more information before opening."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <div className="flex flex-row justify-between items-center">
          <div className="flex gap-2">
            <Link
              className="btn btn-primary btn-square mb-4 mt-4"
              href={Routes.NewProjectPage()}
              data-tooltip-id="new-project-btn"
            >
              <PlusCircleIcon className="h-6 w-6" />
            </Link>
            <Tooltip
              id="new-project-btn"
              content={t("projects.createproject")}
              className="z-[1099] ourtooltips"
            />
            <Suspense fallback={null}>
              <CopyProjectModal />
            </Suspense>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-1">
              <ShieldCheckIcon className="h-6 w-6 text-primary" aria-hidden="true" />
              <span>Project Manager</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="h-6 w-6 text-secondary" aria-hidden="true" />
              <span>Contributor</span>
            </div>
          </div>

          <SearchButton onChange={handleSearch}></SearchButton>
        </div>

        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsList searchTerm={searchTerm} />
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

export default ProjectsPage

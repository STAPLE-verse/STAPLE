import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import ProjectsList from "src/projects/components/ProjectsList"
import SearchButton from "src/core/components/SearchButton"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import TooltipWrapper from "src/core/components/TooltipWrapper"

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }

  return (
    <Layout title="Projects">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center text-3xl">
          All Projects
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="project-overview"
          />
          <TooltipWrapper
            id="project-overview"
            content="This page displays all projects. You can create a new project or search for existing projects. Click on a project name to see more information before opening."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <div className="flex flex-row justify-between items-center">
          <Link className="btn btn-primary mb-4 mt-4" href={Routes.NewProjectPage()}>
            Create Project
          </Link>

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

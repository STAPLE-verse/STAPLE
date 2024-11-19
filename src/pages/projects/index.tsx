import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import ProjectsList from "src/projects/components/ProjectsList"
import SearchButton from "src/core/components/SearchButton"

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }

  return (
    <Layout>
      <Head>
        <title>Projects</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">All Projects</h1>

        <SearchButton onChange={handleSearch}></SearchButton>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsList searchTerm={searchTerm} />
          </Suspense>
        </div>
        <div>
          <Link className="btn btn-primary mb-4 mt-4" href={Routes.NewProjectPage()}>
            Create Project
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default ProjectsPage

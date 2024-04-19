import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import ProjectsList from "src/projects/components/ProjectsList"
import SearchButton from "src/core/components/SearchButton"

const ProjectsPage = () => {
  const sidebarItems = HomeSidebarItems("Projects")

  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0

  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Projects</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Projects</h1>
        <Link className="btn mb-4" href={Routes.NewProjectPage()}>
          Create Project
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="h-6 w-6"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </Link>

        <SearchButton onChange={handleSearch}></SearchButton>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsList searchTerm={searchTerm} currentUser={currentUser} page={page} />
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

export default ProjectsPage

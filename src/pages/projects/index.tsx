import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/projects/queries/getProjects"

const ITEMS_PER_PAGE = 7

export const ProjectsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      {projects.map((project) => (
        <div className="collapse collapse-arrow bg-base-200 mb-2" key={project.id}>
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">{project.name}</div>
          <div className="collapse-content mb-4">
            <p className="mb-2">{project.description}</p>
            <p className="italic mb-2">Last update: {project.updatedAt.toString()}</p>
            {/* TODO: Change button position by other method then using absolute */}
            <div className="justify-end absolute bottom-2 right-6">
              <Link className="btn" href={Routes.ShowProjectPage({ projectId: project.id })}>
                Open
              </Link>
            </div>
          </div>
        </div>
      ))}
      {/* Previous and next page btns */}
      <div className="join grid grid-cols-2 mt-4">
        <button
          className="join-item btn btn-outline"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-outline" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}

const ProjectsPage = () => {
  return (
    <Layout>
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

        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <ProjectsList />
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

export default ProjectsPage

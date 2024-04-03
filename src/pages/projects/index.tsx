import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import router, { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getProjects from "src/projects/queries/getProjects"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { e } from "vitest/dist/index-9f5bc072"

const ITEMS_PER_PAGE = 7

export const ProjectsList = ({ searchTerm }) => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const page = Number(router.query.page) || 0
  // Only list projects that the User is a Contributor on
  // const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
  //   where: {
  //     contributors: {
  //       some: {
  //         userId: currentUser?.id,
  //       },
  //     },
  //   },
  //   orderBy: { id: "asc" },
  //   skip: ITEMS_PER_PAGE * page,
  //   take: ITEMS_PER_PAGE,
  // })

  // let temp = searchTerm == "" ? undefined : `${searchTerm}`
  // console.log(temp)
  let where
  // if (searchTerm == undefined) {
  //   where = {
  //     AND: [
  //       {
  //         contributors: {
  //           some: {
  //             userId: currentUser?.id,
  //           },
  //         },
  //       },
  //     ],
  //   }
  // } else {
  //   where = {
  //     AND: [
  //       {
  //         contributors: {
  //           some: {
  //             userId: currentUser?.id,
  //           },
  //         },
  //       },
  //       {
  //         name: {
  //           contains: `${searchTerm}`,
  //           mode: "insensitive",
  //         },
  //       },
  //     ],
  //   }
  // }

  where = {
    AND: [
      {
        contributors: {
          some: {
            userId: currentUser?.id,
          },
        },
      },
      {
        OR: [
          {
            name: {
              contains: `${searchTerm}`,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: `${searchTerm}`,
              mode: "insensitive",
            },
          },
        ],
      },
    ],
  }

  // OR:[
  //   {
  //     name: {
  //       contains: `${searchTerm}`,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     description: {
  //       contains: `${searchTerm}`,
  //       mode: "insensitive",
  //     },
  //   },

  // ]

  const [{ projects, hasMore }] = usePaginatedQuery(getProjects, {
    where: where,
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
  const sidebarItems = HomeSidebarItems("Projects")

  const [searchTerm, setSearchTerm] = useState("")
  const [inputTextTerm, setInputTextTerm] = useState("")

  const handleSearch = () => {
    setSearchTerm(inputTextTerm)
  }

  const handleInputSearch = (event) => {
    setInputTextTerm(event.target.value)
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
        {/* refactor after testing */}
        <div className="flex flex-row my-4 mx-auto w-full max-w-5xl   justify-between rounded-md shadow-sm">
          <input
            className="w-full h-10"
            type="search"
            placeholder=" Search project"
            value={inputTextTerm}
            onChange={handleInputSearch}
          ></input>
          <button
            className=""
            type="button"
            id="button-addon1"
            data-twe-ripple-init
            data-twe-ripple-color="light"
            onClick={handleSearch}
          >
            <span className="[&>svg]:h-5 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </span>
          </button>
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

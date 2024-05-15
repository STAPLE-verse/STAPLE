import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getProjects from "src/projects/queries/getProjects"
import Table from "src/core/components/Table"
import { projectColumns } from "./ColumnHelpers"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

const LastProject = ({ currentUser }) => {
  const [{ projects }, { isLoading }] = useQuery(getProjects, {
    where: {
      contributors: { some: { userId: currentUser?.id } },
    },
    orderBy: { updatedAt: "asc" },
    take: 3,
  })

  if (isLoading) {
    return <div>Loading projects...</div>
  }

  if (projects.length === 0) {
    return <div className="italic p-2">No projects found.</div>
  }

  return (
    <>
      <div className="card-body">
        <div className="card-title text-base-content">Last Updated Projects</div>
        <Table
          columns={projectColumns}
          data={projects}
          classNames={{
            thead: "text-sm text-base-content",
            tbody: "text-sm text-base-content",
            td: "text-sm text-base-content",
          }}
        />
      </div>
      <div className="card-actions justify-end">
        {" "}
        <Link className="btn btn-primary" href={Routes.ProjectsPage()}>
          Show all projects
        </Link>
      </div>
    </>
  )
}

export default LastProject

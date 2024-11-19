import React from "react"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"

const ProjectCard = ({ project }) => (
  <div className="collapse collapse-arrow bg-base-300 mb-2">
    <input type="checkbox" />
    <div className="collapse-title text-xl font-medium">{project.name}</div>
    <div className="collapse-content mb-4">
      <p className="mb-2">{project.description}</p>
      <p className="italic mb-2">
        Last update: <DateFormat date={project.updatedAt} />
      </p>
      <div className="justify-end absolute bottom-2 right-6">
        <Link
          className="btn btn-primary mb-2"
          href={Routes.ShowProjectPage({ projectId: project.id })}
        >
          Open
        </Link>
      </div>
    </div>
  </div>
)

export default ProjectCard

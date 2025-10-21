// NOTE: Ensure global CSS import exists once in your app entry (e.g., _app.tsx):
// import "react-tooltip/dist/react-tooltip.css"
import React from "react"
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"

const ProjectCard = ({ project }: { project: any }) => {
  const myPrivilege = project?.ProjectPrivilege?.[0]?.privilege
  return (
    <div className="collapse collapse-arrow bg-base-300 mb-4">
      <input type="checkbox" />
      <div className="collapse-title relative overflow-visible text-xl font-medium flex items-center gap-2">
        {myPrivilege === "PROJECT_MANAGER" && (
          <>
            <ShieldCheckIcon
              data-tooltip-id={`pm-tip-${project.id}`}
              className="h-5 w-5 text-primary pointer-events-auto"
              aria-hidden="true"
            />
          </>
        )}
        {myPrivilege === "CONTRIBUTOR" && (
          <>
            <UserIcon
              data-tooltip-id={`contrib-tip-${project.id}`}
              className="h-5 w-5 text-secondary pointer-events-auto"
              aria-hidden="true"
            />
          </>
        )}
        <span>{project.name}</span>
      </div>
      <div className="collapse-content">
        <div className="mb-2 markdown-display">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {project.description || ""}
          </ReactMarkdown>
        </div>
        <p className="italic mb-2">
          Last update: <DateFormat date={project.updatedAt} />
        </p>
        <div className="justify-end card-actions">
          <Link
            className="btn btn-primary"
            href={Routes.ShowProjectPage({ projectId: project.id })}
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard

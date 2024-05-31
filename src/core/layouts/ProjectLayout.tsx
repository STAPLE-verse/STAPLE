import React, { FC, Suspense } from "react"
import { BlitzLayout } from "@blitzjs/next"
import ProjectNavbar from "../components/navbar/ProjectNavbar"

const ProjectLayout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Suspense>
        <ProjectNavbar />
      </Suspense>
      {children}
    </>
  )
}

export default ProjectLayout

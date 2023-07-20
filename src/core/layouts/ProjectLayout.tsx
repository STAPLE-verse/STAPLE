import React, { FC } from "react"
import { BlitzLayout } from "@blitzjs/next"
import ProjectNavbar from "../components/ProjectNavbar"

const ProjectLayout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <ProjectNavbar />
      {children}
    </>
  )
}

export default ProjectLayout

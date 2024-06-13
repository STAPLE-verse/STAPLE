import React, { Suspense } from "react"
import { BlitzLayout } from "@blitzjs/next"
import ProjectNavbar from "../components/navbar/ProjectNavbar"

const ProjectLayout: BlitzLayout<{ children?: React.ReactNode }> = ({ children }) => {
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

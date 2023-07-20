import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"

import getProject from "src/projects/queries/getProject"

const ProjectNavbar = () => {
  const projectId = useParam("projectId", "number")

  let tabs = [
    {
      name: "Tasks",
      href: Routes.TasksPage({ projectId: projectId! }),
    },
    {
      name: "Elements",
      href: Routes.ElementsPage({ projectId: projectId! }),
    },
  ]

  return (
    <div className="">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <Link key={tab.name} href={tab.href}>
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default ProjectNavbar

import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import getProject from "src/projects/queries/getProject"
import { useQuery } from "@blitzjs/rpc"

export const TabTemplate = (tab) => {
  if (tab.hasOwnProperty("children") && tab.children !== null) {
    return (
      <li tabIndex={0} key={tab.name}>
        <details>
          <summary>{tab.name}</summary>
          <ul className="p-2">{tab.children.map((child) => TabTemplate(child))}</ul>
        </details>
      </li>
    )
  } else {
    return (
      <li key={tab.name}>
        <Link href={tab.href}>{tab.name}</Link>
      </li>
    )
  }
}

const ProjectNavbar = () => {
  // Get project data
  const projectId = useParam("projectId", "number")
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  // Define project specific tabs
  let tabs = [
    {
      name: "Dashboard",
      href: Routes.ShowProjectPage({ projectId: projectId! }),
    },
    {
      name: "Tasks",
      href: Routes.TasksPage({ projectId: projectId! }),
    },
    {
      name: "Elements",
      href: Routes.ElementsPage({ projectId: projectId! }),
    },
    {
      name: "Settings",
      href: Routes.EditProjectPage({ projectId: projectId! }),
    },
  ]

  // Return navbar component
  return (
    <>
      <div className="navbar bg-base-100">
        {/* TODO: See if there is a less makeshift solution to center */}
        <div className="navbar-start"></div>
        <div className="navbar-center">
          {/* Title of the project */}
          <h3 className="mr-8">{project.name}</h3>
          <div className="divider divider-horizontal my-4"></div>
          {/* Project specific tabs */}
          <ul className="menu menu-lg lg:menu-horizontal gap-2">
            {tabs.map((tab) => TabTemplate(tab))}
          </ul>
        </div>
        <div className="navbar-end"></div>
      </div>
    </>
  )
}

export default ProjectNavbar

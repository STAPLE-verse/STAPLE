import React, { useContext } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import SidebarContext from "./sidebarContext"
import { useRouter } from "next/router"
import { SidebarItemProps } from "./SidebarItems"

export default function Sidebar() {
  const context = useContext(SidebarContext)

  if (!context || context.sidebarTitle === "Loading Project...") {
    return <div className="loading">Loading...</div>
  }

  const { sidebarTitle, expanded, setSidebarState, sidebarItems } = context

  const toggleExpand = () => {
    setSidebarState({ expanded: !expanded })
  }

  return (
    <>
      <aside className="h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto">
        <nav className="h-full flex flex-col border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Add your logo component here */}
            <h2
              className={`text-2xl overflow-hidden transition-all ${
                expanded ? "w-46" : "w-0"
              } max-w-[15ch] whitespace-nowrap overflow-ellipsis`}
              title={sidebarTitle}
            >
              {sidebarTitle ? sidebarTitle : "Home"}
            </h2>
            <button onClick={toggleExpand} className="p-1.5 rounded-lg hover:bg-indigo-50">
              {expanded ? (
                <ChevronLeftIcon className="w-6 h-6" />
              ) : (
                <ChevronRightIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          <ul className="flex-1 px-3">
            {" "}
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} {...item} />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export function SidebarItem(item: SidebarItemProps) {
  const contextValue = useContext(SidebarContext)
  const router = useRouter()

  if (!contextValue) {
    return null
  }
  const { icon: Icon, text, route, alert, tooltipId } = item
  const { expanded } = contextValue

  const handleClick = async () => {
    try {
      await router.push(route)
    } catch (error) {
      console.error("Failed to navigate:", error)
    }
  }

  return (
    <li
      data-tooltip-id={tooltipId}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        router.pathname === route.pathname
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-400"
      }`}
      onClick={handleClick}
    >
      <Tooltip
        id="project-dashboard-tooltip"
        content="See overall project information dashboard"
        className="z-[1099]"
      />
      <Tooltip
        id="project-tasks-tooltip"
        content="View, add, edit, and complete project specific tasks"
        className="z-[1099]"
      />
      <Tooltip
        id="project-elements-tooltip"
        content="Elements help you organize tasks into buckets"
        className="z-[1099]"
      />
      <Tooltip
        id="project-contributors-tooltip"
        content="Add, edit, and view all people on the project"
        className="z-[1099]"
      />
      <Tooltip
        id="project-teams-tooltip"
        content="Add, edit, and view project teams"
        className="z-[1099]"
      />
      <Tooltip
        id="project-credit-tooltip"
        content="Add, edit, and view contribution explanations with labels"
        className="z-[1099]"
      />
      <Tooltip
        id="project-form-tooltip"
        content="Review and download project form data (metadata)"
        className="z-[1099]"
      />
      <Tooltip
        id="project-summary-tooltip"
        content="Review and download project summary (metadata)"
        className="z-[1099]"
      />
      <Tooltip
        id="project-settings-tooltip"
        content="Add, edit, and view project overview information (metadata)"
        className="z-[1099]"
      />
      <Tooltip
        id="dashboard-tooltip"
        content="View the home page dashboard for all projects"
        className="z-[1099]"
      />
      <Tooltip
        id="projects-tooltip"
        content="View all projects and open a specific one"
        className="z-[1099]"
      />
      <Tooltip id="tasks-tooltip" content="View all tasks for all projects" className="z-[1099]" />
      <Tooltip
        id="forms-tooltip"
        content="Build your own forms to collect data in a task (metadata)"
        className="z-[1099]"
      />
      <Tooltip
        id="notifications-tooltip"
        content="View all notifications for projects"
        className="z-[1099]"
      />
      <Tooltip
        id="labels-tooltip"
        content="View, add, and edit contribution categories with labels"
        className="z-[1099]"
      />
      <Tooltip id="help-tooltip" content="Get help with STAPLE" className="z-[1099]" />
      <Tooltip
        id="project-notification-tooltip"
        content="View notifications for this project"
        className="z-[1099]"
      />

      <Icon className="w-6 h-6" />
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  )
}

import React, { createContext, useContext, useState, ReactNode, MouseEventHandler } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

interface SidebarContextProps {
  expanded: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

interface SidebarProps {
  children: ReactNode
  title?: string
}

export default function Sidebar({ children, title }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <aside className="h-screen">
        <nav className="h-full flex flex-col border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Add your logo component here */}
            <h2
              className={`text-2xl overflow-hidden transition-all ${
                expanded ? "w-46" : "w-0"
              } max-w-[15ch] whitespace-nowrap overflow-ellipsis`}
              title={title}
            >
              {title ? title : "Home"}
            </h2>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg hover:bg-indigo-50"
            >
              {expanded ? (
                <ChevronLeftIcon className="w-6 h-6" />
              ) : (
                <ChevronRightIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </>
  )
}

export interface SidebarItemProps {
  icon: ReactNode
  text: string
  active?: boolean
  alert?: boolean
  onClick?: MouseEventHandler<HTMLLIElement>
  tooltipId: string
}

export function SidebarItem({ icon, text, active, alert, onClick, tooltipId }: SidebarItemProps) {
  const contextValue = useContext(SidebarContext)

  if (!contextValue) {
    // Handle the case where context value is undefined
    return null
  }

  const { expanded } = contextValue

  const handleClick: MouseEventHandler<HTMLLIElement> = (event) => {
    if (onClick) {
      onClick(event)
    }
  }

  //console.log(tooltipId)

  return (
    <li
      data-tooltip-id={tooltipId}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-400"
      }`}
      onClick={handleClick}
    >
      <Tooltip
        id="project-dashboard-tooltip"
        content="See overall project information dashboard"
        className="z-[9999]"
      />
      <Tooltip
        id="project-tasks-tooltip"
        content="View, add, edit, and complete project specific tasks"
        className="z-[9999]"
      />
      <Tooltip
        id="project-elements-tooltip"
        content="Elements help you organize tasks into buckets"
        className="z-[9999]"
      />
      <Tooltip
        id="project-contributors-tooltip"
        content="Add, edit, and view all people on the project"
        className="z-[9999]"
      />
      <Tooltip
        id="project-teams-tooltip"
        content="Add, edit, and view project teams"
        className="z-[9999]"
      />
      <Tooltip
        id="project-credit-tooltip"
        content="Add, edit, and view contribution explanations with labels"
        className="z-[9999]"
      />
      <Tooltip
        id="project-form-tooltip"
        content="Review and download project form data (metadata)"
        className="z-[9999]"
      />
      <Tooltip
        id="project-summary-tooltip"
        content="Review and download project summary (metadata)"
        className="z-[9999]"
      />
      <Tooltip
        id="project-settings-tooltip"
        content="Add, edit, and view project overview information (metadata)"
        className="z-[9999]"
      />
      <Tooltip
        id="dashboard-tooltip"
        content="View the home page dashboard for all projects"
        className="z-[9999]"
      />
      <Tooltip
        id="projects-tooltip"
        content="View all projects and open a specific one"
        className="z-[9999]"
      />
      <Tooltip id="tasks-tooltip" content="View all tasks for all projects" className="z-[9999]" />
      <Tooltip
        id="forms-tooltip"
        content="Build your own forms to collect data in a task (metadata)"
        className="z-[9999]"
      />
      <Tooltip
        id="notifications-tooltip"
        content="View all notifications for projects"
        className="z-[9999]"
      />
      <Tooltip
        id="labels-tooltip"
        content="View, add, and edit contribution categories with labels"
        className="z-[9999]"
      />
      <Tooltip id="help-tooltip" content="Get help with STAPLE" className="z-[9999]" />

      {icon}
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

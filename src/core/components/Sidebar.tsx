import React, { createContext, useContext, useState, ReactNode, MouseEventHandler } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline"

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
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Add your logo component here */}
            <h2 className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>
              {title ? title : "Menu"}
            </h2>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
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
}

export function SidebarItem({ icon, text, active, alert, onClick }: SidebarItemProps) {
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

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
      onClick={handleClick}
    >
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

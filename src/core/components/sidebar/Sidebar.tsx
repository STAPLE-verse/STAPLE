import React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { useRouter } from "next/router"
import { SidebarItemProps } from "./SidebarItems"
import { SidebarState } from "src/core/hooks/useSidebar"
import SidebarTooltips from "./SidebarTooltips"

export default function Sidebar({
  sidebarState,
  expanded,
  toggleExpand,
}: {
  sidebarState: SidebarState
  expanded: boolean
  toggleExpand: () => void
}) {
  const { sidebarTitle, sidebarItems } = sidebarState

  if (!sidebarTitle) {
    return <div className="loading">Loading...</div>
  }

  return (
    <aside className="flex flex-col bg-white border-r shadow-sm">
      <div className="p-4 pb-2 flex justify-between items-center">
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
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-3">
          {" "}
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} {...item} expanded={expanded} />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export function SidebarItem({
  icon: Icon,
  text,
  route,
  alert,
  tooltipId,
  expanded,
}: SidebarItemProps & { expanded: boolean }) {
  const router = useRouter()

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
      <SidebarTooltips />
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

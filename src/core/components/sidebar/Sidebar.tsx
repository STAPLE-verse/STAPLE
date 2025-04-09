import React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router"
import { SidebarItemProps } from "./SidebarItems"
import { SidebarState } from "src/core/hooks/useSidebar"
import SidebarTooltips from "./SidebarTooltips"
import TooltipWrapper from "../TooltipWrapper"

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
    <aside className="flex flex-col border-r shadow-sm">
      <div className="p-4 pb-2 flex justify-between items-center">
        <h2
          className={`text-2xl overflow-hidden transition-all ${
            expanded ? "w-46" : "w-0"
          } max-w-[15ch] whitespace-nowrap overflow-ellipsis`}
          title={sidebarTitle}
        >
          {sidebarTitle ? sidebarTitle : "Home"}
        </h2>
        <button onClick={toggleExpand} className="p-1.5 rounded-lg hover:bg-primary/50">
          {expanded ? (
            <ChevronLeftIcon className="w-6 h-6" data-tooltip-id="chevron-left-tooltip" />
          ) : (
            <ChevronRightIcon className="w-6 h-6" data-tooltip-id="chevron-right-tooltip" />
          )}
        </button>
        <TooltipWrapper
          id="chevron-left-tooltip"
          content="Collapse Menu"
          className="z-[1099] ourtooltips"
          place="right"
        />
        <TooltipWrapper
          id="chevron-right-tooltip"
          content="Expand Menu"
          className="z-[1099] ourtooltips"
          place="right"
        />
      </div>
      <nav className="flex-1">
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
          ? "bg-gradient-to-tr from-primary/30 to-primary/40 text-primary-800"
          : "hover:bg-primary/20 text-primary-400" //covers the hover on the sidebar
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
          className={`absolute right-2 w-2 h-2 rounded bg-primary/200 ${expanded ? "" : "top-2"}`}
        />
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-primary/100 text-primary-800 text-base invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  )
}

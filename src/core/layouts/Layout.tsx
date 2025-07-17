import React from "react"
import Head from "next/head"
import { BlitzLayout } from "@blitzjs/next"
import MainNavbar from "../components/navbar/MainNavbar"
import Sidebar from "../components/sidebar/Sidebar"
import { Toaster } from "react-hot-toast"
import useSidebar from "src/core/hooks/useSidebar"
import useExpanded from "src/core/hooks/useExpanded"

const Layout: BlitzLayout<{
  title?: string
  children?: React.ReactNode
}> = ({ title, children }) => {
  // States for sidebar
  const sidebarState = useSidebar()
  const { expanded, toggleExpand } = useExpanded()

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* @ts-expect-error false positive: JSX children are valid here */}
      <Head>
        <title>{title || "STAPLE"}</title>
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <MainNavbar />
        <div className="flex flex-grow">
          {/* Sidebar */}
          <Sidebar sidebarState={sidebarState} expanded={expanded} toggleExpand={toggleExpand} />
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout

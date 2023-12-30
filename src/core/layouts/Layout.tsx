import Head from "next/head"
import React from "react"
import { BlitzLayout } from "@blitzjs/next"
import MainNavbar from "../components/MainNavbar"
import Sidebar, { SidebarItem } from "../components/Sidebar"
import { HomeIcon } from "@heroicons/react/24/outline"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "STAPLE"}</title>
      </Head>

      <div className="flex flex-col h-screen">
        <MainNavbar />
        <div className="flex flex-grow">
          <Sidebar>
            <SidebarItem icon={<HomeIcon className="w-6 h-6" />} text="Home" alert />
          </Sidebar>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout

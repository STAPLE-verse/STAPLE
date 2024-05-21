import Head from "next/head"
import React, { MouseEventHandler, ReactNode } from "react"
import { BlitzLayout } from "@blitzjs/next"
import MainNavbar from "../components/MainNavbar"
import Sidebar, { SidebarItem, SidebarItemProps } from "../components/Sidebar"
import { Toaster } from "react-hot-toast"
import { Tooltip } from "react-tooltip"

const Layout: BlitzLayout<{
  title?: string
  children?: React.ReactNode
  sidebarItems?: SidebarItemProps[]
  sidebarTitle?: string
}> = ({ title, children, sidebarItems, sidebarTitle }) => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "STAPLE"}</title>
      </Head>

      <div className="flex flex-col h-screen sticky top-0">
        <MainNavbar />
        <div className="flex flex-grow">
          <Sidebar title={sidebarTitle}>
            {sidebarItems?.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                onClick={item.onClick}
                alert={item.alert}
                active={item.active}
                tooltipId={item.tooltipId}
              />
            ))}
          </Sidebar>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout

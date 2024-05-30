import Head from "next/head"
import React from "react"
import { BlitzLayout } from "@blitzjs/next"
import MainNavbar from "../components/MainNavbar"
import Sidebar, { SidebarItem, SidebarItemProps } from "../components/Sidebar"
import { Toaster } from "react-hot-toast"
import { ContributorPrivileges } from "db"

const Layout: BlitzLayout<{
  title?: string
  children?: React.ReactNode
  sidebarItems?: SidebarItemProps[]
  sidebarTitle?: string
  sidebarPrivilege?: ContributorPrivileges
}> = ({ title, children, sidebarItems, sidebarTitle, sidebarPrivilege }) => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "STAPLE"}</title>
      </Head>

      <div className="flex flex-col min-h-screen">
        <MainNavbar />
        <div className="flex flex-grow">
          <Sidebar title={sidebarTitle}>
            <div></div>
            {sidebarItems
              ?.filter((item) => {
                return !item.privilege || !sidebarPrivilege || item.privilege.has(sidebarPrivilege)
              })
              .map((item, index) => (
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
          <div className="flex-1 overflow-scroll p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout

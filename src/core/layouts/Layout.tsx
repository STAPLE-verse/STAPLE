import Head from "next/head"
import React from "react"
import { BlitzLayout } from "@blitzjs/next"
import MainNavbar from "../components/navbar/MainNavbar"
import Sidebar from "../components/sidebar/Sidebar"
import { Toaster } from "react-hot-toast"

const Layout: BlitzLayout<{
  title?: string
  children?: React.ReactNode
}> = ({ title, children }) => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Head>
        <title>{title || "STAPLE"}</title>
      </Head>

      <div className="flex flex-col min-h-screen">
        <MainNavbar />
        <div className="flex flex-grow">
          <Sidebar />
          <div className="flex-1 overflow-scroll p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export default Layout

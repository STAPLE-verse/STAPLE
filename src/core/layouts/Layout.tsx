import Head from "next/head"
import React from "react"
import { BlitzLayout } from "@blitzjs/next"
import MainNavbar from "../components/MainNavbar"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "STAPLE"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <div className="flex flex-grow flex-col">
          <MainNavbar />
          {children}
        </div>
      </div>
    </>
  )
}

export default Layout

import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import React from "react"
import { ElementsList } from "src/elements/components/ElementList"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import SearchButton from "src/core/components/SearchButton"

const Elements = () => {
  const projectId = useParam("projectId", "number")
  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Elements">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Elements</h1>
        <SearchButton onChange={handleSearch}></SearchButton>
        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList searchTerm={searchTerm} />
        </Suspense>
        <div>
          <Link
            className="btn btn-primary mb-4 mt-4"
            href={Routes.NewElementPage({ projectId: projectId! })}
          >
            Create Element
          </Link>
        </div>
      </main>
    </Layout>
  )
}

const ElementsPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Elements />
    </Suspense>
  )
}

ElementsPage.authenticate = true

export default ElementsPage

import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import React from "react"
import { MilestoneList } from "src/milestones/components/MilestoneList"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import SearchButton from "src/core/components/SearchButton"

const Milestones = () => {
  const projectId = useParam("projectId", "number")
  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Milestones">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center mb-2 text-3xl">Milestones</h1>
        <SearchButton onChange={handleSearch}></SearchButton>
        <Suspense fallback={<div>Loading...</div>}>
          <MilestoneList searchTerm={searchTerm} />
        </Suspense>
        <div>
          <Link
            className="btn btn-primary mb-4 mt-4"
            href={Routes.NewMilestonePage({ projectId: projectId! })}
          >
            Create Milestone
          </Link>
        </div>
      </main>
    </Layout>
  )
}

const MilestonesPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Milestones />
    </Suspense>
  )
}

MilestonesPage.authenticate = true

export default MilestonesPage

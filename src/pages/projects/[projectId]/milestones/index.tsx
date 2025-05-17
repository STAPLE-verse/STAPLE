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
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon"
import { Tooltip } from "react-tooltip"
import { Tab } from "@headlessui/react"
import classNames from "classnames"
import GanttChart from "src/milestones/components/GanttChart"

const Milestones = () => {
  const projectId = useParam("projectId", "number")
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState("")
  const handleSearch = (currentSearch) => {
    setSearchTerm(currentSearch)
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Milestones">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center mb-2 text-3xl">
          Milestones
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="milestone-overview"
          />
          <Tooltip
            id="milestone-overview"
            content="This page displays all milestones. You can create a new milestones or search and update existing milestones. Click on a milestone name to see more information."
            className="z-[1099] ourtooltips"
          />
        </h1>

        <div>
          <Tab.Group
            selectedIndex={selectedIndex}
            onChange={(index) => setSelectedIndex(index)}
            defaultIndex={0}
          >
            <div className="flex">
              <Tab.List className="tabs tabs-lifted tabs-lg flex flex-row justify-start space-x-2 bg-base-100">
                {/* Tablink for list view */}
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "tab tab-lifted border",
                      selected
                        ? "tab-active !bg-base-300 [--tab-bg:var(--fallback-b3,oklch(var(--b3)))]"
                        : "!bg-base-100 hover:text-gray-500"
                    )
                  }
                >
                  List
                </Tab>
                {/* TabLink for table view */}
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "tab tab-lifted border",
                      selected
                        ? "tab-active !bg-base-300 [--tab-bg:var(--fallback-b3,oklch(var(--b3)))]"
                        : "!bg-base-100 hover:text-gray-500"
                    )
                  }
                >
                  Gantt
                </Tab>
              </Tab.List>

              <div className="flex justify-end items-start ml-auto items-center">
                <Link
                  className="btn btn-primary mb-4 mt-4"
                  href={Routes.NewMilestonePage({ projectId: projectId! })}
                >
                  Create Milestone
                </Link>
                <div className="ml-2">
                  <SearchButton onChange={handleSearch} />
                </div>
              </div>
            </div>

            <Tab.Panels>
              {/* Tabpanel for expandable milestone list */}
              <Tab.Panel unmount={false}>
                <MilestoneList searchTerm={searchTerm} />
              </Tab.Panel>
              {/* Tabpanel for gantt chart */}
              <Tab.Panel unmount={false}>
                <GanttChart projectId={projectId!} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
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

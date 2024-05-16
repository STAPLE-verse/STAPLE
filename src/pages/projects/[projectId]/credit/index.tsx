import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { Tab } from "@headlessui/react"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import LabelsTab from "./LabelsTab"
import TasksTab from "./TasksTab"
import ContributorsTab from "./ContributorsTab"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const CreditsTabs = () => {
  return (
    <Tab.Group defaultIndex={0}>
      <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
        {/* Tablink for board view */}
        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Add Labels
        </Tab>
        {/* TabLink for table view */}
        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Assign Tasks
        </Tab>

        <Tab
          className={({ selected }) =>
            classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
          }
        >
          Assign Contributors
        </Tab>
        {/* TODO: First click on board does not change it after init */}
      </Tab.List>

      <Tab.Panels>
        {/* Tab for Add Labels */}
        <Tab.Panel>
<<<<<<< label_feature
          <LabelsTab />
          {/* - a table of all the labels for all the PMs on a project - columns: - name - description -
          which PM the label comes from - check box column - For every PM on the project, add the
          labels here with check boxes, then a button to save
          <br />- These will get added to the project table in the database */}
        </Tab.Panel>

        {/* Tabpanel for Assign tasks */}
        <Tab.Panel>
          <TasksTab></TasksTab>
          {/* - Here it should show the complete list of Tasks in a Table - this is only tasks that are
          marked as complete (big task not assignments) - table columns: - name, - description, -
          current labels assigned (like paste them together in a single cell) - add labels button
          that opens a modal that allows you to view the current list of labels and update them save
          and close - add multiple column that has a check box that allows you to apply labels to
          many things at once
          <br />
          Add multiple button that opens a modal to assign the tasks from the check boxes labels all
          at once - not sure how this would be done, but basically you can assign them one at a time
          with the individual button or a lot at once by using the check boxes and this other button */}
        </Tab.Panel>
=======
          <LabelsTab></LabelsTab>
        </Tab.Panel>

        {/* Tabpanel for Assign tasks */}
        <Tab.Panel>{/*<TasksTab></TasksTab>*/}</Tab.Panel>
>>>>>>> main

        {/* Tabpanel for Assign Contributors */}
        <Tab.Panel>
          <ContributorsTab></ContributorsTab>
<<<<<<< label_feature
          {/* - Here it should show the complete list of Contributors in a Table - table columns: -
          username - first last name - current labels assigned (like paste them together in a single
          cell) - add labels button that opens a modal that allows you to view the current list of
          labels and update them save and close - add multiple column that has a check box that
          allows you to apply labels to many things at once
          <br />
          Add multiple button that opens a modal to assign the contributors from the check boxes
          labels all at once - not sure how this would be done, but basically you can assign them
          one at a time with the individual button or a lot at once by using the check boxes and
          this other button */}
=======
>>>>>>> main
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

const CreditPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Credit")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Assign Labels to Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        {
          <Suspense fallback={<div>Loading...</div>}>
            <CreditsTabs />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default CreditPage

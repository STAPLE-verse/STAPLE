import { Suspense } from "react"
import Head from "next/head"
import { Tab } from "@headlessui/react"

import Layout from "src/core/layouts/Layout"
import LabelsTab from "./LabelsTab"
import TasksTab from "./TasksTab"
import ContributorsTab from "./ContributorsTab"
import { useEffect, useState } from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const CreditsTabs = () => {
  //const [selectedIndex, setSelectedIndex] = useState(0)

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
          <LabelsTab></LabelsTab>
        </Tab.Panel>

        {/* Tabpanel for Assign tasks */}
        <Tab.Panel>
          <TasksTab></TasksTab>
        </Tab.Panel>

        {/* Tabpanel for Assign Contributors */}
        <Tab.Panel>
          <ContributorsTab></ContributorsTab>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

const CreditPage = () => {
  return (
    <Layout>
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

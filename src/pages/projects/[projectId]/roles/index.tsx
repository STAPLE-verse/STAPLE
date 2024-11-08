import { Suspense } from "react"
import Head from "next/head"
import { Tab } from "@headlessui/react"
import Layout from "src/core/layouts/Layout"
import TasksTab from "src/roles/components/TasksTab"
import ContributorsTab from "src/roles/components/ContributorsTab"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const RolesTabs = () => {
  return (
    <Tab.Group defaultIndex={0}>
      <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
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
        {/* Tabpanel for Assign tasks */}
        <Tab.Panel>
          <TasksTab />
        </Tab.Panel>

        {/* Tabpanel for Assign Contributors */}
        <Tab.Panel>
          <ContributorsTab />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

const RolesPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Assign Roles</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        {
          <Suspense fallback={<div>Loading...</div>}>
            <RolesTabs />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default RolesPage

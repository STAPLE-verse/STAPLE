import { Suspense } from "react"
import { Tab } from "@headlessui/react"
import Layout from "src/core/layouts/Layout"
import TasksTab from "src/roles/components/TasksTab"
import ContributorsTab from "src/roles/components/ContributorsTab"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const RolesTabs = () => {
  return (
    <>
      <h1 className="flex justify-center items-center mb-2 text-3xl">
        Project Roles
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="project-roles-tooltip"
        />
        <Tooltip
          id="project-roles-tooltip"
          content="Assign roles to tasks or contributors by selecting one or many at once. This helps track responsibilities and team structure."
          className="z-[1099] ourtooltips"
        />
      </h1>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2">
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
    </>
  )
}

const RolesPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Assign Roles">
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

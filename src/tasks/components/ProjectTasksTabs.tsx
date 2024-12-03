import { Tab } from "@headlessui/react"
import { Routes } from "@blitzjs/next"
import TaskBoard from "src/tasks/components/TaskBoard"
import Link from "next/link"
import { MemberPrivileges } from "@prisma/client"
import { ProjectTasksList } from "src/tasks/components/ProjectTasksList"
import clsx from "clsx"

export const ProjectTasksTabs = ({ projectPrivilege, projectId }) => {
  return (
    <>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
          {/* Tablink for board view */}
          {projectPrivilege === MemberPrivileges.PROJECT_MANAGER && (
            <Tab as="button" className={({ selected }) => clsx("tab", selected && "tab-active")}>
              Board
            </Tab>
          )}
          {/* TabLink for table view */}
          <Tab as="button" className={({ selected }) => clsx("tab", selected && "tab-active")}>
            Table
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Tabpanel for kanban board */}
          {projectPrivilege === MemberPrivileges.PROJECT_MANAGER && (
            <Tab.Panel unmount={false}>
              <TaskBoard />
            </Tab.Panel>
          )}
          {/* Tabpanel for table view */}
          <Tab.Panel unmount={false}>
            <ProjectTasksList />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}
      {projectPrivilege == MemberPrivileges.PROJECT_MANAGER && (
        <p>
          <Link
            className="btn mt-4 btn-primary"
            href={Routes.NewTaskPage({ projectId: projectId! })}
          >
            Create New Task
          </Link>
        </p>
      )}
    </>
  )
}

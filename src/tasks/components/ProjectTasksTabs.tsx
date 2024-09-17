import { Tab } from "@headlessui/react"
import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import TaskBoard from "src/tasks/components/TaskBoard"
import Link from "next/link"
import { MemberPrivileges } from "@prisma/client"
import { ProjectTasksList } from "src/tasks/components/ProjectTasksList"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"
import { useState } from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const ProjectTasksTabs = () => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentProjectMember(projectId)
  //const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
          {/* Tablink for board view */}
          {currentProjectMember?.privilege === MemberPrivileges.PROJECT_MANAGER && (
            <Tab
              className={({ selected }) =>
                classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
              }
              onClick={() => console.log("Board tab clicked")}
            >
              Board
            </Tab>
          )}
          {/* TabLink for table view */}
          <Tab
            className={({ selected }) =>
              classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
            }
            onClick={() => console.log("Table tab clicked")}
          >
            Table
          </Tab>
          {/* TODO: First click on board does not change it after init */}
        </Tab.List>

        <Tab.Panels>
          {/* Tabpanel for kanban board */}
          {currentProjectMember?.privilege === MemberPrivileges.PROJECT_MANAGER && (
            <Tab.Panel>
              <TaskBoard projectId={projectId!} />
            </Tab.Panel>
          )}
          {/* Tabpanel for table view */}
          <Tab.Panel>
            <ProjectTasksList />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}
      {currentProjectMember?.privilege == MemberPrivileges.PROJECT_MANAGER && (
        <p>
          <Link
            className="btn mt-4 btn-primary"
            href={Routes.NewTaskPage({ projectId: projectId! })}
          >
            Create New Task
          </Link>
        </p>
      )}
    </div>
  )
}

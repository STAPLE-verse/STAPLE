import { Tab } from "@headlessui/react"
import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import TaskBoard from "src/tasks/components/TaskBoard"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/contributors/queries/getContributor"
import { ContributorPrivileges } from "@prisma/client"
import { ProjectTaskListPM } from "src/tasks/components/ProjectTaskListPM"
import { ProjectTaskListContrib } from "src/tasks/components/ProjectTaskListContrib"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const ProjectTasksList = () => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  return (
    <div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-4">
          {/* Tablink for board view */}
          {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER && (
            <Tab
              className={({ selected }) =>
                classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
              }
            >
              Board
            </Tab>
          )}
          {/* TabLink for table view */}
          <Tab
            className={({ selected }) =>
              classNames("tab", selected ? "tab-active" : "hover:text-gray-500")
            }
          >
            Table
          </Tab>
          {/* TODO: First click on board does not change it after init */}
        </Tab.List>

        <Tab.Panels>
          {/* Tabpanel for kanban board */}
          {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER && (
            <Tab.Panel>
              <TaskBoard projectId={projectId!} />
            </Tab.Panel>
          )}
          {/* Tabpanel for table view */}
          <Tab.Panel>
            {currentContributor.privilege === ContributorPrivileges.CONTRIBUTOR && (
              <ProjectTaskListContrib />
            )}

            {currentContributor.privilege === ContributorPrivileges.PROJECT_MANAGER && (
              <ProjectTaskListPM />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Create new task btn */}
      {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
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

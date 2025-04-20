import { Tab } from "@headlessui/react"
import { Routes } from "@blitzjs/next"
import TaskBoard from "src/tasks/components/TaskBoard"
import Link from "next/link"
import { MemberPrivileges } from "@prisma/client"
import { ProjectTasksList } from "src/tasks/components/ProjectTasksList"
import clsx from "clsx"
import createColumnMutation from "src/tasks/mutations/createColumn"
import { useState } from "react"
import AddContainer from "src/tasks/components/AddContainer"
import { useMutation } from "@blitzjs/rpc"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

export const ProjectTasksTabs = ({ projectPrivilege, projectId }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [showAddColumnModal, setShowAddColumnModal] = useState(false)
  const [createColumn] = useMutation(createColumnMutation)
  const defaultAddColumn = async (name: string) => {
    await createColumn({ projectId: projectId!, name })
  }
  const [taskBoardAddColumn, setTaskBoardAddColumn] = useState<(name: string) => void>(
    () => defaultAddColumn
  )

  const handleAddColumn = async (name: string) => {
    taskBoardAddColumn(name)
    setShowAddColumnModal(false)
  }

  return (
    <>
      <h1 className="flex justify-center items-center text-3xl">
        Project Tasks
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="project-tasks"
        />
        <Tooltip
          id="project-tasks"
          content={
            projectPrivilege === MemberPrivileges.PROJECT_MANAGER
              ? "This page shows all the project tasks in a table layout or kanban board layout. In the board layout, you can move tasks, add new columns, and mark tasks as done by moving them to the 'Done' column. Tasks that are done appear in green, and the table layout shows percent completion."
              : "This page shows all the project tasks assigned to you in a table format, with percent complete based on the number of sub-assignments you've been given."
          }
          className="z-[1099] ourtooltips"
        />
      </h1>
      {projectPrivilege === MemberPrivileges.PROJECT_MANAGER && (
        <div className="flex justify-center mt-2 mb-2 gap-2">
          <Link className="btn btn-primary" href={Routes.NewTaskPage({ projectId: projectId! })}>
            Create New Task
          </Link>
          {selectedIndex === 0 && (
            <>
              <button className="btn btn-secondary" onClick={() => setShowAddColumnModal(true)}>
                Add New Column
              </button>
              <AddContainer
                projectId={projectId}
                show={showAddColumnModal}
                onClose={() => setShowAddColumnModal(false)}
                onSubmitName={handleAddColumn}
              />
            </>
          )}
        </div>
      )}

      {projectPrivilege !== MemberPrivileges.CONTRIBUTOR && (
        <Tab.Group
          selectedIndex={selectedIndex}
          onChange={(index) => setSelectedIndex(index)}
          defaultIndex={0}
        >
          {projectPrivilege === MemberPrivileges.PROJECT_MANAGER && (
            <Tab.List className="tabs tabs-boxed flex flex-row justify-center space-x-2 mb-2">
              {/* Tablink for board view */}
              <Tab as="button" className={({ selected }) => clsx("tab", selected && "tab-active")}>
                Board
              </Tab>
              {/* TabLink for table view */}
              <Tab as="button" className={({ selected }) => clsx("tab", selected && "tab-active")}>
                Table
              </Tab>
            </Tab.List>
          )}

          <Tab.Panels>
            {/* Tabpanel for kanban board */}
            {projectPrivilege === MemberPrivileges.PROJECT_MANAGER && (
              <Tab.Panel unmount={false}>
                <TaskBoard onAddColumn={(fn) => setTaskBoardAddColumn(() => fn)} />
              </Tab.Panel>
            )}
            {/* Tabpanel for table view */}
            <Tab.Panel unmount={false}>
              <ProjectTasksList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
      {projectPrivilege === MemberPrivileges.CONTRIBUTOR && <ProjectTasksList />}
    </>
  )
}

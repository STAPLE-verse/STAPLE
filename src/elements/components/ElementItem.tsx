import { Routes } from "@blitzjs/next"
import { Task, Element } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import UpdateTasks from "./UpdateTasks"
import DateFormat from "src/core/components/DateFormat"

interface ElementItemProps {
  element: Element
  projectId: number
  tasks: Task[]
  onTasksUpdated: () => void
}

const ElementItem: React.FC<ElementItemProps> = ({ element, projectId, tasks, onTasksUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Filter tasks to get only the tasks for the current element
  const elementTasks = tasks.filter((task) => task.elementId === element.id)

  return (
    <div className="collapse collapse-arrow bg-base-300 mb-2" key={element.id}>
      {/* Don't change this one it's not a check box */}
      <input type="checkbox" />
      {/* Element name */}
      <div className="collapse-title text-xl font-medium">{element.name}</div>
      <div className="collapse-content mb-4">
        {/* Element description */}
        <p className="mb-2">{element.description}</p>
        {/* Element last update */}
        <p className="italic mb-2">
          Last update: <DateFormat date={element.updatedAt}></DateFormat>
        </p>

        {/* Tasks in the element */}
        <div className="divider font-medium">Tasks</div>
        <div className="flex flex-row overflow-x-auto space-x-4 pb-6">
          {elementTasks && elementTasks.length > 0 ? (
            elementTasks.map((task) => (
              <div key={task.id} className="card bg-base-100 text-base-content flex-shrink-0 w-1/4">
                <div className="card-body">
                  {/* Task name */}
                  <div className="card-title text-base-content justify-center">{task.name}</div>
                  {task.description && <div>{task.description.substring(0, 50)}</div>}
                  {task.deadline ? (
                    <p className="italic mb-2">
                      Deadline: <DateFormat date={task.deadline}></DateFormat>
                    </p>
                  ) : (
                    <p className="italic mb-2">No deadline</p>
                  )}
                </div>
                {/* TODO: Possibly add more information for the tasks */}
                {/* Show task page */}
                <div className="card-actions justify-center mb-2">
                  <Link
                    className="btn btn-secondary"
                    href={Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id })}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>There are no tasks in the element.</p>
          )}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          {/* Show element page */}
          <Link
            className="btn btn-primary"
            href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}
          >
            View Element
          </Link>
          {/* Update tasks in the element */}
          <button className="btn btn-secondary" onClick={openModal}>
            Update Tasks
          </button>
          <UpdateTasks
            elementId={element.id}
            open={isModalOpen}
            onClose={closeModal}
            onTasksUpdated={onTasksUpdated}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  )
}

export default ElementItem

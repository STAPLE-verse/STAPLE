import { Routes } from "@blitzjs/next"
import { Task, Element } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import UpdateTasks from "./UpdateTasks"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"

interface ElementItemProps {
  element: Element & { task?: Task[] }
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
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">{element.name}</div>
      <div className="collapse-content mb-4">
        <p className="mb-2">{element.description}</p>
        <p className="italic mb-2">
          Last update:{" "}
          {element.updatedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Use 24-hour format
          })}
        </p>
        <div className="divider">Tasks</div>
        <div className="flex flex-row bg-base-100 rounded-lg">
          {elementTasks && elementTasks.length > 0 ? (
            elementTasks.map((task) => (
              <div key={task.id} className="card bg-base-100 text-base-content m-2 w-1/4">
                <div className="card-body">
                  <div className="card-title text-base-content justify-center">{task.name}</div>
                  {task.description && <div>{task.description.substring(0, 50)}</div>}
                </div>
                <div className="card-actions justify-center">
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
          <Link
            className="btn btn-primary"
            href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}
          >
            View Element
          </Link>
          <button className="btn btn-primary" onClick={openModal}>
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

import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { Element, Task } from "db"
import { DndContext } from "@dnd-kit/core"
import TaskCard from "src/tasks/components/TaskCard"

interface ElementsListProps {
  // Element type extended with Task array
  elements: (Element & { Task?: Task[] })[]
  projectId: number
}

export const ElementsList: React.FC<ElementsListProps> = ({ elements, projectId }) => {
  return (
    <div>
      {elements.map((element) => {
        // Get tasks for the element
        const tasks = element.Task

        return (
          <div className="collapse collapse-arrow bg-base-200 mb-2" key={element.id}>
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">{element.name}</div>
            <div className="collapse-content mb-4">
              <p className="mb-2">{element.description}</p>
              <p className="italic mb-2">Last update: {element.updatedAt.toString()}</p>
              <div className="divider">Tasks</div>
              <div className="flex flex-col">
                {tasks && tasks.length > 0 ? (
                  <DndContext>
                    {tasks.map((task) => (
                      <TaskCard
                        taskId={task.id}
                        key={task.id}
                        name={task.name}
                        projectId={task.projectId}
                      />
                    ))}
                  </DndContext>
                ) : (
                  <p>There are no tasks in the element.</p>
                )}
              </div>
              <div className="justify-end mt-2">
                <Link
                  className="btn"
                  href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}
                >
                  Open
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

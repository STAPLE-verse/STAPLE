import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { Element, Task } from "db"
import { DndContext, useDroppable } from "@dnd-kit/core"
import TaskCard from "src/tasks/components/TaskCard"

interface ElementsListProps {
  // Element type extended with Task array
  elements: (Element & { Task?: Task[] })[]
  projectId: number
}

export const ElementsList: React.FC<ElementsListProps> = ({ elements, projectId }) => {
  // const { isOver, setNodeRef } = useDroppable({
  //   id: `element-${element.id}`,
  // })

  // const style = {
  //   boxShadow: isOver ? "0 0 8px gray" : undefined,
  // }

  return (
    <div>
      {elements.map((element) => {
        // Get tasks for the element
        const tasks = element.Task

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
              <div
                className="flex flex-col flex-1 bg-gray-300 p-4 rounded-lg"
                // ref={setNodeRef}
                // style={style}
              >
                {tasks && tasks.length > 0 ? (
                  <DndContext>
                    {tasks.map((task) => (
                      <TaskCard
                        taskId={task.id}
                        key={task.id}
                        name={task.name}
                        projectId={task.projectId}
                        // disable={true}
                      />
                    ))}
                  </DndContext>
                ) : (
                  <p>There are no tasks in the element.</p>
                )}
              </div>
              <div className="justify-end mt-4">
                <Link
                  className="btn btn-primary"
                  href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}
                >
                  View Element
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

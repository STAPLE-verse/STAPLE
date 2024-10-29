import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { HTMLAttributes, ClassAttributes } from "react"

// get specific components for this board
import TaskContainer from "src/tasks/components/TaskContainer"
import TaskItems from "src/tasks/components/TaskItems"
import AddContainer from "./AddContainer"
import useTaskBoardData from "../hooks/useTaskBoardData"
// Get helper functions
import { findContainerTitle, findContainerItems, findItemValue } from "../utils/findHelpers"
import useDragHandlers from "../hooks/useDragHandlers"

//interface
interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  // Setup
  const { containers, refetch, updateContainers } = useTaskBoardData(projectId)
  const { handleDragStart, handleDragMove, handleDragEnd, activeId } = useDragHandlers({
    containers,
    updateContainers,
  })

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="mx-auto max-w-7xl py-10">
      <AddContainer projectId={projectId} refetch={refetch}></AddContainer>
      <div className="mt-10">
        <div className="grid grid-cols-3 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <TaskContainer id={container.id} title={container.title} key={container.id}>
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      {container.items.map((i) => (
                        <TaskItems
                          title={i.title}
                          id={i.id}
                          key={i.id}
                          projectId={projectId}
                          completed={i.completed}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </TaskContainer>
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <TaskItems
                  id={activeId}
                  title={findItemValue(activeId, containers, "title") || ""}
                  completed={findItemValue(activeId, containers, "completed") || false}
                  projectId={projectId}
                />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <TaskContainer id={activeId} title={findContainerTitle(activeId, containers)}>
                  {findContainerItems(activeId, containers).map((i) => (
                    <TaskItems
                      key={i.id}
                      title={i.title}
                      id={i.id}
                      completed={i.completed}
                      projectId={projectId}
                    />
                  ))}
                </TaskContainer>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default TaskBoard

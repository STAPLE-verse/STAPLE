// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// see here https://github.com/microsoft/TypeScript/issues/49613

//packages
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
import { findItemTitle, findContainerTitle, findContainerItems } from "../utils/findHelpers"
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
                        <TaskItems title={i.title} id={i.id} key={i.id} projectId={projectId} />
                      ))}
                    </div>
                  </SortableContext>
                </TaskContainer>
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <TaskItems id={activeId} title={findItemTitle(activeId, containers)} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <TaskContainer id={activeId} title={findContainerTitle(activeId, containers)}>
                  {findContainerItems(activeId, containers).map((i) => (
                    <TaskItems key={i.id} title={i.title} id={i.id} />
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

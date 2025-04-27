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
// get specific components for this board
import TaskContainer from "src/tasks/components/TaskContainer"
import TaskItems from "src/tasks/components/TaskItems"
import AddContainer from "./AddContainer"
import useTaskBoardData from "../hooks/useTaskBoardData"
// Get helper functions
import { findContainerTitle, findContainerItems, findItemValue } from "../utils/findHelpers"
import useDragHandlers from "../hooks/useDragHandlers"
import { useParam } from "@blitzjs/next"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import { useEffect, useCallback } from "react"
import { useMutation } from "@blitzjs/rpc"
import createColumnMutation from "src/tasks/mutations/createColumn"

const TaskBoard = ({
  onAddColumn,
}: {
  onAddColumn?: (fn: (name: string) => Promise<void>) => void
}) => {
  // Setup
  const projectId = useParam("projectId", "number")
  const { containers, refetch, updateContainers } = useTaskBoardData(projectId)
  const { handleDragStart, handleDragMove, handleDragEnd, activeId } = useDragHandlers({
    containers,
    updateContainers,
  })

  const [createColumn] = useMutation(createColumnMutation)

  const addColumn = useCallback(
    async (name: string) => {
      await createColumn({ projectId: projectId!, name })
      await refetch()
    },
    [projectId, createColumn, refetch]
  )

  useEffect(() => {
    if (onAddColumn) {
      // @ts-ignore
      onAddColumn(addColumn)
    }
  }, [onAddColumn, addColumn])

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="rounded-b-box rounded-tr-box bg-base-300">
      <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
        <div className="grid grid-cols-3 gap-4 bg-base-300">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {/*@ts-expect-error Suppress missing children error from SortableContext*/}
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <div key={container.id}>
                  <TaskContainer id={container.id} title={container.title}>
                    {/*@ts-expect-error Suppress missing children error from SortableContext*/}
                    <SortableContext items={container.items.map((i) => i.id)}>
                      <div className="flex items-start flex-col gap-y-4">
                        {container.items.map((i) => (
                          <TaskItems
                            title={i.title}
                            id={i.id}
                            // @ts-ignore: suppress key error, can't change key assignment
                            key={i.id}
                            projectId={projectId!}
                            completed={i.completed}
                            newCommentsCount={i.newCommentsCount}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </TaskContainer>
                </div>
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <TaskItems
                  id={activeId}
                  title={findItemValue(activeId, containers, "title") || ""}
                  completed={findItemValue(activeId, containers, "completed") || false}
                  projectId={projectId!}
                  // Drag overlay doesn't need newCommentsCount shown, so skip it for now
                />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <TaskContainer id={activeId} title={findContainerTitle(activeId, containers)}>
                  {findContainerItems(activeId, containers).map((i) => (
                    <div key={i.id}>
                      <TaskItems
                        title={i.title}
                        id={i.id}
                        completed={i.completed}
                        projectId={projectId!}
                      />
                    </div>
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

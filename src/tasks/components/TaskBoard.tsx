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
import { makeDragId } from "../utils/dragId"
import TaskItemPreview from "./TaskItemPreview"
import TaskContainerPreview from "./TaskContainerPreview"
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
  const { containers, updateContainers, refetch } = useTaskBoardData(projectId!)
  const { handleDragStart, handleDragMove, handleDragEnd, activeData } = useDragHandlers({
    containers,
    updateContainers,
    refetch,
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
            <SortableContext items={containers.map((c) => makeDragId("container", c.id))}>
              {containers.map((container) => (
                <TaskContainer
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  onRefetch={refetch}
                >
                  <SortableContext
                    items={container.items.map((item) => makeDragId("item", item.id))}
                  >
                    <div className="flex items-start flex-col gap-y-4">
                      {container.items.map((i) => (
                        <TaskItems
                          title={i.title}
                          id={i.id}
                          // @ts-ignore: suppress key error, can't change key assignment
                          key={makeDragId("item", i.id)}
                          projectId={projectId!}
                          completed={i.completed}
                          containerId={container.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </TaskContainer>
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {activeData?.type === "item" && (
                <TaskItemPreview
                  title={findItemValue(activeData.taskId, containers, "title") || ""}
                  completed={findItemValue(activeData.taskId, containers, "completed") || false}
                />
              )}
              {activeData?.type === "container" && (
                <TaskContainerPreview
                  title={findContainerTitle(activeData.columnId, containers)}
                  items={findContainerItems(activeData.columnId, containers)}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default TaskBoard

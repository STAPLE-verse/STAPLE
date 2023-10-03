import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskOrderSchema } from "../schemas"

// I am so sorry for this function...
export default resolver.pipe(
  resolver.zod(UpdateTaskOrderSchema),
  resolver.authorize(),
  async ({ activeId, overId }) => {
    // Get the active task
    const activeTask = await db.task.findUnique({
      where: {
        id: activeId,
      },
    })
    // Get columns because overid is the column id if the column is empty
    const columns = await db.column.findMany({
      where: {
        projectId: activeTask?.projectId,
      },
    })

    function findContainer(id, columns) {
      const columnIds = columns.map((column) => column.id)
      if (id in columnIds) {
        return id
      }

      const matchingColumn = columns.find((column) => column.id === overId)

      if (matchingColumn) {
        return matchingColumn.id
      } else {
        console.log("Column not found")
      }
    }

    const overContainerId = findContainer(overId, columns)

    // Check if task is dropped in another container
    // And update column id if there is a change
    // if (activeTask?.columnId !== overContainerId) {
    //   // Update columnTaskIndex in activeTask
    //   await db.task.update({
    //     where: { id: activeId },
    //     data: { columnId: overContainerId },
    //   })
    // }

    // If the overContainer is empty the new index will be 0
    const columnIds = columns.map((column) => column.id)

    if (overId in columnIds) {
      await db.task.update({
        where: { id: activeId },
        data: { columnTaskIndex: 0, columnId: overContainerId },
      })
    } else {
      // Get the over task
      const overTask = await db.task.findUnique({
        where: {
          id: overId,
        },
      })

      const updateActiveTask = db.task.update({
        where: { id: activeId },
        data: { columnTaskIndex: overTask?.columnTaskIndex, columnId: overContainerId },
      })

      // Update the columnTaskIndex for the task of newTaskId
      const updateOverTask = db.task.update({
        where: { id: overId },
        data: { columnTaskIndex: activeTask?.columnTaskIndex },
      })

      // Perform both updates concurrently using Promise.all
      await Promise.all([updateActiveTask, updateOverTask])
    }

    // Return a success message or any relevant response
    return { message: "Task order updated successfully" }
  }
)

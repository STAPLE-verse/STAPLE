import { useQuery } from "@blitzjs/rpc"
import { useEffect, useMemo, useState } from "react"
import getColumns from "../queries/getColumns"
import { KanbanBoard, Task, Status } from "db"

interface ColumnWithTasks extends KanbanBoard {
  tasks: Task[]
}

// Define type for dnd-kit
export type DNDType = {
  // containers (columns)
  id: string
  title: string
  // items (tasks)
  items: {
    id: string
    title: string
    completed: boolean
  }[]
}

export default function useTaskBoardData(projectId) {
  // Create state for storing the columns with the tasks
  const [containers, setContainers] = useState<DNDType[]>([])

  // Get data
  const [columns, { refetch }]: [ColumnWithTasks[], any] = useQuery(getColumns, {
    orderBy: { containerOrder: "asc" },
    where: { project: { id: projectId! } },
    include: {
      tasks: {
        orderBy: {
          // Keep the order of the tasks by the query
          containerTaskOrder: "asc",
        },
      },
    },
    skip: undefined,
    take: undefined,
  })

  const transformedData = useMemo(() => {
    return columns.map((column) => ({
      id: `container-${column.id}`,
      title: column.name,
      items: column.tasks.map((task) => ({
        id: `item-${task.id}`,
        title: task.name,
        completed: task.status === Status.COMPLETED,
      })),
    }))
  }, [columns])

  useEffect(() => {
    setContainers(transformedData)
  }, [transformedData])

  return { containers, refetch, updateContainers: setContainers }
}

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
  id: number
  title: string
  // items (tasks)
  items: {
    id: number
    title: string
    completed: boolean
  }[]
}

export default function useTaskBoardData(projectId: number) {
  // Create state for storing the columns with the tasks
  const [containers, setContainers] = useState<DNDType[]>([])

  // Get data
  const [columns, { refetch }]: [ColumnWithTasks[], any] = useQuery(getColumns, {
    orderBy: { containerOrder: "asc" },
    where: { project: { id: projectId! } },
    include: {
      tasks: {
        orderBy: {
          containerTaskOrder: "asc",
        },
      },
    },
  })

  const transformedData = useMemo(() => {
    return columns.map((column) => ({
      id: column.id,
      title: column.name,
      items: column.tasks.map((task) => ({
        id: task.id,
        title: task.name,
        completed: task.status === Status.COMPLETED,
      })),
    }))
  }, [columns])

  useEffect(() => {
    setContainers(transformedData)
  }, [transformedData])

  return {
    containers,
    updateContainers: setContainers,
    refetch,
  }
}

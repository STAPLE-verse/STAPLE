import { useQuery } from "@blitzjs/rpc"
import { useCallback, useEffect, useState } from "react"
import getColumns from "../queries/getColumns"
import { UniqueIdentifier } from "@dnd-kit/core"
import { Column, Task } from "db"

interface ColumnWithTasks extends Column {
  tasks: Task[]
}

export default function useTaskBoardData(projectId) {
  // Define type for dnd-kit
  type DNDType = {
    id: UniqueIdentifier
    title: string
    items: {
      id: UniqueIdentifier
      title: string
    }[]
  }
  // Create state for storing the columns with the tasks
  const [containers, setContainers] = useState<DNDType[]>([])

  // Create a callback for updating containers state
  const updateContainers = useCallback((newContainers) => {
    setContainers(newContainers)
  }, [])

  // Get data
  const [columns, { refetch }]: [ColumnWithTasks[], any] = useQuery(getColumns, {
    orderBy: { columnIndex: "asc" },
    where: { project: { id: projectId! } },
    include: {
      tasks: {
        orderBy: {
          // Keep the order of the tasks by the query
          columnTaskIndex: "asc",
        },
      },
    },
  })

  useEffect(() => {
    // Transform query data to the desired structure
    const transformedData = columns.map((container) => ({
      id: `container-${container.id}`,
      title: container.name,
      items: container.tasks.map((task) => ({
        id: `item-${task.id}`,
        title: task.name,
      })),
    }))

    // Update state with the transformed data
    setContainers(transformedData)
  }, [columns])

  return { containers, refetch, updateContainers }
}

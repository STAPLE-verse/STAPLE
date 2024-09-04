import { useEffect } from "react"
import { useParam } from "@blitzjs/next"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import "react-circular-progressbar/dist/styles.css"
import React, { useState } from "react"
import {
  DndContext,
  KeyboardSensor,
  TouchSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import updateProjectWidgets from "src/widgets/mutations/updateProjectWidgets"
import getProjectWidgets from "src/widgets/queries/getProjectWidgets"
import toast from "react-hot-toast"
import useDashboardDragHandlers from "src/widgets/hooks/useDashboardDragHandlers"
import initializeProjectWidgets from "src/widgets/mutations/initializeProjectWidgets"
// import { ProjectWidget, Widget } from "db"
import { useWidgetConstruction } from "src/widgets/hooks/useWidgetConstruction"
import { sortWidgets } from "src/widgets/utils/sortWidgets"
import { WidgetContainer } from "src/widgets/components/WidgetContainer"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"

const ProjectDashboard = () => {
  const [updateWidgetMutation] = useMutation(updateProjectWidgets)
  const [initializeWidgetsMutation] = useMutation(initializeProjectWidgets)

  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const userId = currentUser?.id!
  const { privilege } = useContributorPrivilege()

  // TODO: tried to define projectwidget type but there was a type mismatch in useeffect
  const [widgets, setWidgets] = useState<any[]>([])

  const [fetchedWidgets] = useQuery(getProjectWidgets, {
    userId: currentUser?.id!,
    projectId: projectId!,
  })

  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      const sortedWidgets = sortWidgets(fetchedWidgets)
      setWidgets(sortedWidgets)
    } else {
      initializeWidgetsMutation({ userId: userId, projectId: projectId!, privilege: privilege! })
        .then((createdWidgets) => {
          setWidgets(createdWidgets)
          toast.success(`Dashboard added successfully!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [fetchedWidgets, initializeWidgetsMutation, privilege, projectId, userId])

  const constructedWidgets = useWidgetConstruction({
    widgets,
    registryType: "project",
    privilege: privilege!,
  })

  const { handleDragEnd } = useDashboardDragHandlers({
    setWidgets,
    updateWidgetMutation,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="flex flex-col space-y-4">
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <WidgetContainer widgets={constructedWidgets} />
      </DndContext>
    </div>
  )
}

export default ProjectDashboard

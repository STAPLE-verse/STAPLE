import { useMutation } from "@blitzjs/rpc"
import "react-circular-progressbar/dist/styles.css"
import React from "react"
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
import useDashboardDragHandlers from "src/widgets/hooks/useDashboardDragHandlers"
import { useWidgetConstruction } from "src/widgets/hooks/useWidgetConstruction"
import { WidgetContainer } from "src/widgets/components/WidgetContainer"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"

const ProjectDashboard = ({ widgets, setWidgets }) => {
  const [updateWidgetMutation] = useMutation(updateProjectWidgets)
  const { privilege } = useMemberPrivileges()

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

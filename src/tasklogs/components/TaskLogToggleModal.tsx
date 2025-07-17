import CompleteToggle from "./CompleteToggle"
import { useParam } from "@blitzjs/next"
import { CompletedAs } from "db"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import ToggleModal from "src/core/components/ToggleModal"
import { eventBus } from "src/core/utils/eventBus"

export const TaskLogToggleModal = ({
  taskLog,
  refetchTaskData,
}: {
  taskLog: any
  refetchTaskData?: () => Promise<void>
}) => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentContributor(projectId)

  const handleClose = () => {
    eventBus.emit("taskLogUpdated")
  }

  return (
    <ToggleModal
      buttonLabel="Edit Status"
      buttonClassName="btn-info w-full"
      modalTitle="Edit Task Completion"
      saveButton={true}
      onClose={handleClose}
    >
      <CompleteToggle
        taskLog={taskLog}
        completedById={currentProjectMember!.id}
        completedAs={taskLog.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
        refetchTaskData={refetchTaskData}
      />
    </ToggleModal>
  )
}

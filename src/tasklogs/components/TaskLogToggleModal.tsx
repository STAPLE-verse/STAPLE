import CompleteToggle from "./CompleteToggle"
import { useParam } from "@blitzjs/next"
import { CompletedAs } from "db"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import ToggleModal from "src/core/components/ToggleModal"

export const TaskLogToggleModal = ({ taskLog }) => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentContributor(projectId)

  return (
    <ToggleModal buttonLabel="Edit" modalTitle="Edit Task Completion">
      <CompleteToggle
        taskLog={taskLog}
        completedById={currentProjectMember!.id}
        completedAs={taskLog.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
      />
    </ToggleModal>
  )
}

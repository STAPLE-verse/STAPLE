import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { useTaskContext } from "./TaskContext"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { useParam } from "@blitzjs/next"
import getComments from "src/comments/queries/getComments"
import { ProjectMemberWithTaskLog } from "src/core/types"
import { useSeparateProjectMembers } from "src/projectmembers/hooks/useSeparateProjectMembers"
import { TaskLogCompleteColumns } from "src/tasklogs/tables/columns/TaskLogCompleteColumns"
import { TaskLogFormColumns } from "src/tasklogs/tables/columns/TaskLogFormColumns"
import {
  processIndividualTaskLogs,
  processTeamTaskLogs,
} from "src/tasklogs/tables/processing/processTaskLogs"
import { filterFirstTaskLog } from "src/tasklogs/utils/filterFirstTaskLog"
import getProjectPrivilege from "src/projectprivileges/queries/getProjectPrivilege"
import getCurrentUser from "src/users/queries/getCurrentUser"

interface TaskLogTableProps {
  contributorFilter?: number
}

export const TaskLogTable = ({ contributorFilter }: TaskLogTableProps) => {
  // Get values
  const { task, projectMembers } = useTaskContext()
  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)
  const [data, { isError, error, refetch }] = useQuery(getCurrentUser, null)

  const [contributorPrivilege] = useQuery(getProjectPrivilege, {
    where: { userId: data!.id, projectId: projectId },
  })

  const { individualProjectMembers, teamProjectMembers } =
    useSeparateProjectMembers<ProjectMemberWithTaskLog>(projectMembers)

  // Fetch all comments for task logs
  // Fetch all first task log IDs for teams
  const firstTaskLogIds = [
    ...individualProjectMembers.map((member) => filterFirstTaskLog(member.taskLogAssignedTo)?.id),
    ...teamProjectMembers.map((team) => filterFirstTaskLog(team.taskLogAssignedTo)?.id),
  ].filter((id): id is number => id !== undefined) // Remove undefined values

  const [comments, { refetch: refetchComments }] = useQuery(getComments, {
    where: { taskLogId: { in: firstTaskLogIds } },
  })

  // Preprocess taskLogs to include only the latest log
  const individualProjectMembersFiltered = contributorFilter
    ? individualProjectMembers.filter((member) =>
        member.users?.some((user) => user.id === contributorFilter)
      )
    : individualProjectMembers

  const processedIndividualAssignments = processIndividualTaskLogs(
    individualProjectMembersFiltered,
    comments,
    task.name,
    currentContributor!.id,
    contributorPrivilege.privilege,
    task.formVersion?.schema,
    task.formVersion?.uiSchema,
    refetchComments,
    task.deadline
  )

  const teamProjectMembersFiltered = contributorFilter
    ? teamProjectMembers.filter((team) => team.users?.some((user) => user.id === contributorFilter))
    : teamProjectMembers

  const processedTeamAssignments = processTeamTaskLogs(
    teamProjectMembersFiltered,
    comments,
    task.name,
    currentContributor!.id,
    contributorPrivilege.privilege,
    task.formVersion?.schema,
    task.formVersion?.uiSchema,
    refetchComments,
    task.deadline
  )

  // Get columns definitions for tables
  const individualColumns = task.formVersionId ? TaskLogFormColumns : TaskLogCompleteColumns
  const allProcessedLogs = [...processedIndividualAssignments, ...processedTeamAssignments]

  return (
    <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
      <div className="overflow-x-auto">
        <Table data={allProcessedLogs} columns={individualColumns} addPagination={true} />
      </div>
    </div>
  )
}

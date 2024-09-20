import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { processFinishedTasks } from "../utils/processTasks"

export const ProjectMembersTaskListDone = ({ projectMember, columns }) => {
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      assignedMembers: {
        some: {
          id: projectMember.id, // Filter tasks assigned to this specific project member
        },
      },
    },
    include: {
      taskLogs: {
        where: {
          assignedToId: projectMember.id, // Ensure task logs are only for this project member
        },
        orderBy: { createdAt: "desc" }, // Order by createdAt, descending
      },
      assignedMembers: {
        include: {
          users: true, // Include user details for each assigned project member
        },
      },
      project: true, // Include project details if needed
      roles: true, // Include roles details if needed
    },
    orderBy: { id: "asc" }, // Order tasks by ID
  })

  const completedTasks = tasks
    .map((task) => ({
      ...task,
      assignees: task["assignees"].filter(
        (assignee) =>
          assignee.statusLogs.length > 0 && assignee.statusLogs[0].status === "COMPLETED"
      ),
    }))
    .filter((task) => task.assignees.length > 0)

  const processedTasks = processFinishedTasks(completedTasks)

  return (
    <div>
      <Table columns={columns} data={processedTasks} addPagination={true} />
    </div>
  )
}

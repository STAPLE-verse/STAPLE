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

  const completedTasks = tasks.filter((task) => {
    const latestLog = task.taskLogs[0] // Since logs are ordered by createdAt desc, the first one is the latest
    return latestLog && latestLog.status === "COMPLETED"
  })

  const processedTasks = processFinishedTasks(completedTasks)

  return (
    <div>
      <Table columns={columns} data={processedTasks} addPagination={true} />
    </div>
  )
}

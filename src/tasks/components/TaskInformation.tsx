import { useQuery } from "@blitzjs/rpc"
import { useContext } from "react"
import { TaskContext } from "./TaskContext"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import DateFormat from "src/core/components/DateFormat"
import CollapseCard from "src/core/components/CollapseCard"
import { ExtendedTask, ProjectMemberWithUsername } from "src/core/types"

export const TaskInformation = () => {
  const taskContext = useContext(TaskContext)
  const task = taskContext?.task as ExtendedTask

  const [pmData] = useQuery(getProjectMember, {
    where: { id: task?.createdById },
    include: { users: { select: { username: true, firstName: true, lastName: true } } },
  })

  const pm = pmData as ProjectMemberWithUsername

  if (!taskContext || !task) {
    return <div>Loading...</div>
  }

  return (
    <CollapseCard
      title="Task Information"
      className="w-full"
      tooltipContent="Overall information about this task"
    >
      <p>
        <span className="font-semibold">Name: </span> {task.name}
      </p>

      <p>
        <span className="font-semibold">Deadline:</span>{" "}
        {task.deadline ? <DateFormat date={task.deadline}></DateFormat> : "No Deadline"}
      </p>

      <p>
        <span className="font-semibold">Description:</span>{" "}
        {task.description ? task.description : "No Description"}
      </p>

      <p>
        <span className="font-semibold">Status:</span> {task["container"]?.name}
      </p>

      <p>
        <span className="font-semibold">Milestone:</span>{" "}
        {task["milestone"] ? task["milestone"]!.name : "No milestone"}
      </p>

      <p>
        <span className="font-semibold">Created by: </span>
        {pm.users[0].firstName
          ? `${pm.users[0].firstName} ${pm.users[0].lastName}`
          : `${pm.users[0].username}`}{" "}
      </p>

      <p className="italic">
        Last update: <DateFormat date={task.updatedAt}></DateFormat>
      </p>
    </CollapseCard>
  )
}

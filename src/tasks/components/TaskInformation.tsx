import { useQuery } from "@blitzjs/rpc"
import { useContext } from "react"
import { TaskContext } from "./TaskContext"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import DateFormat from "src/core/components/DateFormat"
import Card from "src/core/components/Card"
import { ProjectMemberWithUsername } from "src/core/types"

export const TaskInformation = () => {
  const taskContext = useContext(TaskContext)
  const task = taskContext?.task

  const [pmData] = useQuery(getProjectMember, {
    where: { id: task?.createdById },
    include: { users: { select: { username: true, firstName: true, lastName: true } } },
  })

  const pm = pmData as ProjectMemberWithUsername

  if (!taskContext || !task) {
    return <div>Loading...</div>
  }

  return (
    <Card
      title="Task Information"
      className="mx-2 w-full"
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
        <span className="font-semibold">Column:</span> {task["container"]?.name}
      </p>

      <p>
        <span className="font-semibold">Element:</span>{" "}
        {task["element"] ? task["element"].name : "No element"}
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
    </Card>
  )
}

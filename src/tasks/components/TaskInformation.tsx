import { useQuery } from "@blitzjs/rpc"
import { useContext } from "react"
import { Tooltip } from "react-tooltip"
import { TaskContext } from "./TaskContext"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { ProjectMember } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"

interface ProjectMemberWithUsername extends ProjectMember {
  users: {
    username: string
  }
}

export const TaskInformation = () => {
  const taskContext = useContext(TaskContext)
  const task = taskContext?.task
  const [pmData] = useQuery(getProjectMember, {
    where: { id: task?.createdById },
    include: { users: { select: { username: true } } },
  })

  const pm = pmData as ProjectMemberWithUsername

  console.log(pm)

  if (!taskContext || !task) {
    return <div>Loading...</div>
  }

  return (
    <div className="card bg-base-300 mx-2 w-1/3">
      <div className="card-body">
        <div className="card-title" data-tooltip-id="tool-task">
          Task Information
        </div>
        <Tooltip
          id="tool-task"
          content="Overall information about this task"
          className="z-[1099] ourtooltips"
        />

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
          <span className="font-semibold">Created by:</span> {pm.users[0].username}
        </p>

        <p className="italic">
          Last update: <DateFormat date={task.updatedAt}></DateFormat>
        </p>
      </div>
    </div>
  )
}

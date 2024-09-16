import { useQuery } from "@blitzjs/rpc"
import { useContext } from "react"
import { Tooltip } from "react-tooltip"
import { TaskContext } from "./TaskContext"
import getContributor from "src/projectmembers/queries/getContributor"
import { Contributor } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"

interface ContributorWithUsername extends Contributor {
  user: {
    username: string
  }
}

export const TaskInformation = () => {
  const taskContext = useContext(TaskContext)
  const task = taskContext?.task
  const [pmData] = useQuery(getContributor, {
    where: { id: task?.createdById },
    include: { user: { select: { username: true } } },
  })

  const pm = pmData as ContributorWithUsername

  if (!taskContext || !task) {
    return <div>Loading...</div>
  }

  return (
    <div className="card bg-base-300 mx-2 w-1/2">
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
          <span className="font-semibold">Description:</span> {task.description}
        </p>

        <p>
          <span className="font-semibold">Column:</span> {task["column"]?.name}
        </p>

        <p>
          <span className="font-semibold">Element:</span>{" "}
          {task["element"] ? task["element"].name : "No element"}
        </p>

        <p>
          <span className="font-semibold">Created by:</span> {pm?.user?.username}
        </p>

        <p className="italic">
          Last update: <DateFormat date={task.updatedAt}></DateFormat>
        </p>
      </div>
    </div>
  )
}

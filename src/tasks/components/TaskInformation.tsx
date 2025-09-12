import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
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
        <span className="font-semibold">Start Date:</span>{" "}
        {task.startDate ? <DateFormat date={task.startDate}></DateFormat> : "No Start Date"}
      </p>
      <p>
        <span className="font-semibold">Deadline:</span>{" "}
        {task.deadline ? <DateFormat date={task.deadline}></DateFormat> : "No Deadline"}
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
      <p>
        <span className="font-semibold">Roles: </span>
        {task.roles && task.roles.length > 0 ? (
          task.roles.map((role: { name: string }, index: number) => (
            <span
              key={index}
              className="ml-2 inline-block bg-secondary text-white px-2 py-1 rounded"
            >
              {role.name}
            </span>
          ))
        ) : (
          <span className="ml-2 italic">No roles</span>
        )}
      </p>
      {task.tags && Array.isArray(task.tags) && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="font-semibold">Tags: </span>
          {task.tags.map((tag: { key: string; value: string }, index: number) => (
            <span
              key={index}
              className="bg-primary text-white text-md font-semibold px-2 py-1 rounded"
            >
              {tag.value}
            </span>
          ))}
        </div>
      )}
      <p>
        <span className="font-semibold">Last update: </span>
        <DateFormat date={task.updatedAt} />
      </p>
      <div className="divider pt-1 pb-1"></div>
      <span className="font-semibold text-xl">Instructions:</span>{" "}
      {task.description ? (
        <div className="markdown-display mt-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                />
              ),
            }}
          >
            {task.description}
          </ReactMarkdown>
        </div>
      ) : (
        <span className="italic">No instructions</span>
      )}
    </CollapseCard>
  )
}

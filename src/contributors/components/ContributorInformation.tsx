import { getPrivilegeText } from "src/core/utils/getPrivilegeText"
import { MemberPrivileges, User } from "db"
import CollapseCard from "src/core/components/CollapseCard"
import DateFormat from "src/core/components/DateFormat"
import { Tooltip } from "react-tooltip"
import { useQuery } from "@blitzjs/rpc"
import { eventBus } from "src/core/utils/eventBus"
import { useEffect } from "react"
import getTasks from "src/tasks/queries/getTasks"
import { useParam } from "@blitzjs/next"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { TaskLogWithTask } from "src/core/types"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { completedFormPercentage } from "src/widgets/utils/completedFormPercentage"
import { completedTaskLogPercentage } from "src/widgets/utils/completedTaskLogPercentage"
import { roleDistribution } from "src/widgets/utils/roleDistribution"
import { GetCircularProgressDisplay } from "src/core/components/GetWidgetDisplay"
import { PieChartWidget } from "src/widgets/components/PieChartWidget"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { completedTaskApprovalPercentage } from "src/widgets/utils/completedTaskApprovalPercentage"

interface ContributorInformationProps {
  contributorPrivilege: MemberPrivileges
  contributorUser: User
}

const ContributorInformation = ({
  contributorPrivilege,
  contributorUser,
}: ContributorInformationProps) => {
  const projectId = useParam("projectId", "number")
  const contributorId = useParam("contributorId", "number")

  // get tasks for this user and projectId
  const [{ tasks }, { refetch: refetchTasks }] = useQuery(getTasks, {
    include: {
      roles: true,
    },
    where: {
      projectId: projectId,
      assignedMembers: {
        some: {
          id: contributorId, // Filter tasks by user in assignedMembers
        },
      },
    },
  })

  // get taskLogs for those tasks
  const [{ taskLogs: fetchedTaskLogs }, { refetch: refetchTaskLogs }] = useQuery(getTaskLogs, {
    where: {
      taskId: { in: tasks.map((task) => task.id) },
      assignedToId: contributorId,
    },
    include: {
      task: true,
    },
  }) as unknown as [TaskLogWithTask[], { refetch: () => Promise<any> }]

  useEffect(() => {
    const handleUpdate = () => {
      void refetchTasks()
      void refetchTaskLogs()
    }
    eventBus.on("taskLogUpdated", handleUpdate)
    return () => eventBus.off("taskLogUpdated", handleUpdate)
  }, [refetchTasks, refetchTaskLogs])

  // Cast and handle the possibility of `undefined`
  const taskLogs: TaskLogWithTask[] = (fetchedTaskLogs ?? []) as TaskLogWithTask[]

  // only the latest task log
  const allTaskLogs = getLatestTaskLogs<TaskLogWithTask>(taskLogs)

  // Calculate summary data
  const formPercent = completedFormPercentage(allTaskLogs)
  const taskPercent = completedTaskLogPercentage(allTaskLogs)
  const rolePieData = roleDistribution(tasks)
  const approvalPercent = completedTaskApprovalPercentage(allTaskLogs)

  const [ProjectMember, { setQueryData }] = useQuery(getProjectMember, {
    where: {
      id: contributorId,
      projectId: projectId,
    },
  })

  return (
    <CollapseCard title="Contributor Information" defaultOpen={true} className="mt-4">
      {contributorUser.firstName && contributorUser.lastName && (
        <p>
          <span className="font-semibold">Username:</span> {contributorUser.username}
        </p>
      )}
      <p>
        <span className="font-semibold">Email:</span> {contributorUser.email}
      </p>
      <p>
        <span className="font-semibold">Privilege:</span> {getPrivilegeText(contributorPrivilege)}
      </p>
      <p>
        <span className="font-semibold">Added to Project: </span>{" "}
        {<DateFormat date={contributorUser.createdAt}></DateFormat>}
      </p>
      {ProjectMember.tags &&
        (() => {
          const tagsArray =
            typeof ProjectMember.tags === "string"
              ? JSON.parse(ProjectMember.tags)
              : ProjectMember.tags

          return (
            Array.isArray(tagsArray) &&
            tagsArray.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-semibold mr-2">Tags:</span>
                {tagsArray.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary text-primary-content rounded px-2 py-1 text-md font-medium"
                  >
                    {typeof tag === "object" && tag !== null && "value" in tag ? tag.value : ""}
                  </span>
                ))}
              </div>
            )
          )
        })()}
      <div className="stats bg-base-300 text-lg font-bold w-full mt-2">
        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="task-status-tooltip">
            Task Status
          </div>
          <Tooltip
            id="task-status-tooltip"
            content="Percent of overall tasks completed by the contributor"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 ? (
            <>No tasks were found</>
          ) : (
            <>
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={taskPercent} />
              </div>
            </>
          )}
        </div>

        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="task-approval-tooltip">
            Task Approval
          </div>
          <Tooltip
            id="task-approval-tooltip"
            content="Percent of overall tasks approved"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 ? (
            <>No tasks were found</>
          ) : (
            <>
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={approvalPercent} />
              </div>
            </>
          )}
        </div>

        <div className="stat place-items-center">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="form-status-tooltip">
            <>Form Data</>
          </div>
          <Tooltip
            id="form-status-tooltip"
            content="Percent of required forms completed by the contributor"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 || formPercent <= 0 ? (
            <>No forms were required</>
          ) : (
            <>
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={formPercent} />
              </div>
            </>
          )}
        </div>
        <PieChartWidget
          data={rolePieData}
          titleWidget={"Role Distribution"}
          tooltip={"The distribution of roles across tasks assigned to the team"}
          noData={tasks.length === 0 || rolePieData.length === 0}
          noDataText="No tasks with roles found"
        />
      </div>
    </CollapseCard>
  )
}

export default ContributorInformation

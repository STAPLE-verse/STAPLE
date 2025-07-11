import { useParam } from "@blitzjs/next"
import { Task } from "db"
import CollapseCard from "src/core/components/CollapseCard"
import { PeopleWithTasksRoles, processTagPeople } from "../tables/processing/processTagPeople"
import {
  processProjectTasks,
  ProjectTasksData,
} from "src/tasks/tables/processing/processProjectTasks"
import {
  MilestoneWithTasksRoles,
  processTagMilestones,
} from "../tables/processing/processTagMilestones"
import { TagPeopleData } from "../tables/columns/TagPeopleColumns"
import { FlagIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { GetCircularProgressDisplay, GetIconDisplay } from "src/core/components/GetWidgetDisplay"

interface TagOverallProps {
  tasks: Task[]
  people: PeopleWithTasksRoles[]
  milestones: MilestoneWithTasksRoles[]
}

export const TagOverall = ({ people, tasks, milestones }: TagOverallProps) => {
  const projectId = useParam("projectId", "number")
  const processedPeople: TagPeopleData[] = processTagPeople(people, projectId!)
  const processedTasks: ProjectTasksData[] = processProjectTasks(tasks)
  const processedMilestones = processTagMilestones(milestones)

  const numIndividuals = processedPeople.filter((p) => p.type === "Individual").length
  const numTeams = processedPeople.filter((p) => p.type === "Team").length
  const numMilestones = processedMilestones.length

  const numCompletedTasks = processedTasks.filter((task) => task.status === "Completed").length
  const totalAssigned = processedTasks.reduce((sum, task) => sum + (task.numberAssigned ?? 0), 0)
  const totalCompleted = processedTasks.reduce(
    (sum, task) => sum + Math.round((task.percentComplete / 100) * (task.numberAssigned ?? 0)),
    0
  )

  const totalPercentComplete =
    totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0

  const totalApproved = processedTasks.reduce(
    (sum, task) => sum + Math.round((task.percentApproved / 100) * (task.numberAssigned ?? 0)),
    0
  )

  const totalPercentApproved =
    totalAssigned > 0 ? Math.round((totalApproved / totalAssigned) * 100) : 0

  const totalFormAssignments = processedTasks.reduce(
    (sum, task) => sum + (task.formAssigned ? task.numberAssigned ?? 0 : 0),
    0
  )

  const totalFormsComplete = processedTasks.reduce(
    (sum, task) =>
      sum +
      (task.formAssigned
        ? Math.round((task.percentComplete / 100) * (task.numberAssigned ?? 0))
        : 0),
    0
  )

  const percentFormsComplete =
    totalFormAssignments > 0 ? Math.round((totalFormsComplete / totalFormAssignments) * 100) : 0

  return (
    <CollapseCard title="Tag Summary" className="mt-4" defaultOpen={true}>
      <div className="stats bg-base-300 text-lg font-bold w-full flex flex-wrap divide-x divide-base-100">
        <div className="stat w-1/3 place-items-center p-4">
          <div
            className="stat-title text-2xl text-inherit"
            data-tooltip-id="contributor-number-tooltip"
          >
            Contributors
          </div>
          <Tooltip
            id="contributor-number-tooltip"
            content="Number of individual contributors"
            className="z-[1099] ourtooltips"
          />
          <GetIconDisplay number={numIndividuals} icon={UsersIcon} />
        </div>

        <div className="stat w-1/3 place-items-center p-4">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="team-number-tooltip">
            Teams
          </div>
          <Tooltip
            id="team-number-tooltip"
            content="Number of project teams"
            className="z-[1099] ourtooltips"
          />
          <GetIconDisplay number={numTeams} icon={UserGroupIcon} />
        </div>

        <div className="stat w-1/3 place-items-center p-4">
          <div
            className="stat-title text-2xl text-inherit"
            data-tooltip-id="milestone-number-tooltip"
          >
            Milestones
          </div>
          <Tooltip
            id="mileston-number-tooltip"
            content="Number of tagged milestones"
            className="z-[1099] ourtooltips"
          />
          <GetIconDisplay number={numMilestones} icon={FlagIcon} />
        </div>

        <div className="stat w-1/3 place-items-center p-4">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="task-status-tooltip">
            Task Status
          </div>
          <Tooltip
            id="task-status-tooltip"
            content="Percent of overall tasks completed by individuals or teams"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 ? (
            <>No tasks were found</>
          ) : (
            <div className="w-20 h-20 m-2">
              <GetCircularProgressDisplay proportion={totalPercentComplete / 100} />
            </div>
          )}
        </div>

        <div className="stat w-1/3 place-items-center p-4">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="task-approval-tooltip">
            Task Approval
          </div>
          <Tooltip
            id="task-approval-tooltip"
            content="Percent of overall tasks approved by the project manager"
            className="z-[1099] ourtooltips"
          />
          {tasks.length === 0 ? (
            <>No tasks were found</>
          ) : (
            <div className="w-20 h-20 m-2">
              <GetCircularProgressDisplay proportion={totalPercentApproved / 100} />
            </div>
          )}
        </div>

        <div className="stat w-1/3 place-items-center p-4">
          <div className="stat-title text-2xl text-inherit" data-tooltip-id="form-status-tooltip">
            <>Form Data</>
          </div>
          <Tooltip
            id="form-status-tooltip"
            content="Percent of required forms completed by individuals or teams"
            className="z-[1099] ourtooltips"
          />
          <div className="h-24 flex items-center justify-center">
            {totalFormAssignments === 0 ? (
              <span>No forms required</span>
            ) : (
              <div className="w-20 h-20 m-2">
                <GetCircularProgressDisplay proportion={percentFormsComplete / 100} />
              </div>
            )}
          </div>
        </div>
      </div>
    </CollapseCard>
  )
}

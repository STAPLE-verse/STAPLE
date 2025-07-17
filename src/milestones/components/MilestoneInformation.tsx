import Table from "src/core/components/Table"
import { Milestone } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"
import { MilestoneTasksColumns } from "../tables/columns/MilestoneTasksColumns"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import CollapseCard from "src/core/components/CollapseCard"
import { MilestoneTasksData } from "../tables/processing/processMilestoneTasks"
import { MilestoneSummary } from "./MilestoneSummary"
import { ProjectTasksColumns } from "src/tasks/tables/columns/ProjectTasksColumns"
import { ProjectTasksData } from "src/tasks/tables/processing/processProjectTasks"

interface MilestoneInformationProps {
  milestone: Milestone
  processedTasks: ProjectTasksData[]
  projectId: number
}

export const MilestoneInformation: React.FC<MilestoneInformationProps> = ({
  milestone,
  processedTasks,
  projectId,
}) => {
  return (
    <>
      <CollapseCard title="Milestone Information" defaultOpen={true}>
        {/* Milestone name */}
        <div className="card-title" data-tooltip-id="milestone-tool">
          {milestone.name}
        </div>
        <TooltipWrapper
          id="milestone-tool"
          content="Overall milestone information"
          className="z-[1099] ourtooltips"
        />
        {/* Milestone description */}
        {milestone.description}

        {/* Milestone start and end dates */}
        {milestone.startDate && (
          <p>
            <strong>Start Date:</strong> <DateFormat date={milestone.startDate} />
          </p>
        )}
        {milestone.endDate && (
          <p>
            <strong>End Date:</strong> <DateFormat date={milestone.endDate} />
          </p>
        )}

        {/* Milestone tags */}
        {Array.isArray(milestone.tags) && milestone.tags.length > 0 && (
          <p>
            <strong>Tags:</strong>{" "}
            {milestone.tags.map((tag: { key: string; value: string }, idx: number) => (
              <span
                key={idx}
                className="bg-primary text-white text-md font-medium px-2 py-1 rounded-md mx-1 inline-block"
              >
                {tag.value}
              </span>
            ))}
          </p>
        )}
        {/* Milestone last update */}
        <p className="italic">
          Last update: <DateFormat date={milestone.updatedAt}></DateFormat>
        </p>
      </CollapseCard>

      <MilestoneSummary milestone={milestone} projectId={projectId} />

      <CollapseCard title="Tasks" className="mt-4">
        <div className="overflow-x-auto">
          <Table columns={ProjectTasksColumns} data={processedTasks} addPagination={true} />
        </div>
      </CollapseCard>
    </>
  )
}

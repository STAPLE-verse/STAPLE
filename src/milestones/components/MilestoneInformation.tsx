import Table from "src/core/components/Table"
import { Milestone } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"
import { MilestoneTasksColumns } from "../tables/columns/MilestoneTasksColumns"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import CollapseCard from "src/core/components/CollapseCard"
import { MilestoneTasksData } from "../tables/processing/processMilestoneTasks"
import { MilestoneSummary } from "./MilestoneSummary"

interface MilestoneInformationProps {
  milestone: Milestone
  processedTasks: MilestoneTasksData[]
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
        {/* Milestone last update */}
        <p className="italic">
          Last update: <DateFormat date={milestone.updatedAt}></DateFormat>
        </p>
      </CollapseCard>

      <MilestoneSummary milestone={milestone} projectId={projectId} />

      <CollapseCard title="Tasks" className="mt-4">
        <div className="overflow-x-auto">
          <Table columns={MilestoneTasksColumns} data={processedTasks} addPagination={true} />
        </div>
      </CollapseCard>
    </>
  )
}

import Table from "src/core/components/Table"
import CollapseCard from "src/core/components/CollapseCard"
import { TagMilestoneColumns } from "../tables/columns/TagMilestoneColumns"
import { processTagMilestones } from "../tables/processing/processTagMilestones"
import { MilestoneWithTasksRoles } from "../tables/processing/processTagMilestones"
interface TagMilestoneTableProps {
  milestones: MilestoneWithTasksRoles[]
}

export const TagMilestoneTable = ({ milestones }: TagMilestoneTableProps) => {
  const processedMilestones = processTagMilestones(milestones)
  return (
    <CollapseCard title="Milestones" className="mt-4">
      <div className="overflow-x-auto">
        <Table columns={TagMilestoneColumns} data={processedMilestones} addPagination={true} />
      </div>
    </CollapseCard>
  )
}

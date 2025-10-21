import { TagPeopleColumns, TagPeopleData } from "../tables/columns/TagPeopleColumns"
import Table from "src/core/components/Table"
import { PeopleWithTasksRoles, processTagPeople } from "../tables/processing/processTagPeople"
import CollapseCard from "src/core/components/CollapseCard"
import { useParam } from "@blitzjs/next"

interface TagPeopleTableProps {
  people: PeopleWithTasksRoles[]
}

export const TagPeopleTable = ({ people }: TagPeopleTableProps) => {
  const projectId = useParam("projectId", "number")
  const processedPeople: TagPeopleData[] = processTagPeople(people, projectId!)

  return (
    <CollapseCard title="Contributors" className="mt-4">
      <div className="overflow-x-auto">
        <Table columns={TagPeopleColumns} data={processedPeople} addPagination={true} />
      </div>
    </CollapseCard>
  )
}

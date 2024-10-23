import Table from "src/core/components/Table"
import { processProjectMemberTableData } from "../tables/processing/processProjectMemberTableData"
import { RoleProjectMemberTableColumns } from "../tables/columns/RoleProjectMemberTableColumns"

export const RoleContributorTable = ({
  projectMembers,
  selectedIds,
  roleChanged,
  handleMultipleChanged,
}) => {
  const RoleProjectMemberTableData = processProjectMemberTableData(
    projectMembers,
    roleChanged,
    selectedIds,
    handleMultipleChanged
  )

  return (
    <Table
      columns={RoleProjectMemberTableColumns}
      data={RoleProjectMemberTableData}
      addPagination={true}
    />
  )
}

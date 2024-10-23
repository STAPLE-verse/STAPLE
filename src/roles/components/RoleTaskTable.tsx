import Table from "src/core/components/Table"
import { RoleTaskTableColumns } from "src/roles/tables/columns/RoleTaskTableColumns"
import { processRoleTaskTableData } from "../tables/processing/processRoleTaskTableData"

export const RoleTaskTable = ({ tasks, selectedIds, roleChanged, handleMultipleChanged }) => {
  const RoleTaskTableData = processRoleTaskTableData(
    tasks,
    selectedIds,
    roleChanged,
    handleMultipleChanged
  )

  return <Table columns={RoleTaskTableColumns} data={RoleTaskTableData} addPagination={true} />
}

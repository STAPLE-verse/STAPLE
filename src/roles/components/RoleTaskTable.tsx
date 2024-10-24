import Table from "src/core/components/Table"
import { RoleTaskTableColumns } from "src/roles/tables/columns/RoleTaskTableColumns"

export const RoleTaskTable = ({ tasks }) => {
  const processedData = tasks.map((task) => ({
    name: task.name,
    description: task.description || "",
    id: task.id,
    rolesNames: task.roles ? task.roles.map((role) => role.name).join(", ") : "",
  }))

  return <Table columns={RoleTaskTableColumns} data={processedData} addPagination={true} />
}

import Table from "src/core/components/Table"
import { useRoleTaskTableColumns } from "src/roles/tables/columns/RoleTaskTableColumns"

export const RoleTaskTable = ({ tasks }) => {
  const processedData = tasks.map((task) => ({
    name: task.name,
    description: task.description || "",
    id: task.id,
    rolesNames: task.roles ? task.roles.map((role) => role.name).join(", ") : "",
  }))

  const columns = useRoleTaskTableColumns(processedData)

  return <Table columns={columns} data={processedData} addPagination={true} />
}

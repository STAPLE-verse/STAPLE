import Table from "src/core/components/Table"
import { useRoleContributorTableColumns } from "../tables/columns/RoleContributorTableColumns"

export const RoleContributorTable = ({ contributors }) => {
  const processedData = contributors.map((contributor) => ({
    username: contributor.users[0].username,
    firstname: contributor.users[0].firstName,
    lastname: contributor.users[0].lastName,
    id: contributor.id,
    roleNames: contributor.roles ? contributor.roles.map((role) => role.name).join(", ") : "",
  }))

  const columns = useRoleContributorTableColumns(processedData)

  return <Table columns={columns} data={processedData} addPagination={true} />
}

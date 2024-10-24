import Table from "src/core/components/Table"
import { RoleContributorTableColumns } from "../tables/columns/RoleContributorTableColumns"

export const RoleContributorTable = ({ contributors }) => {
  const processedData = contributors.map((contributor) => ({
    username: contributor.users[0].username,
    firstname: contributor.users[0].firstName,
    lastname: contributor.users[0].lastName,
    id: contributor.id,
    roleNames: contributor.roles ? contributor.roles.map((role) => role.name).join(", ") : "",
  }))

  return <Table columns={RoleContributorTableColumns} data={processedData} addPagination={true} />
}

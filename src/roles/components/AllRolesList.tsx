import Table from "src/core/components/Table"
import { RoleTableColumns } from "../tables/columns/RoleTableColumns"
import { processRoleTableData } from "../tables/processing/processRoleTableData"

export const AllRolesList = ({ roles, onChange, taxonomyList }) => {
  // Process table data
  const roleTableData = processRoleTableData(roles, onChange, taxonomyList)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={RoleTableColumns} data={roleTableData} addPagination={true} />
    </main>
  )
}

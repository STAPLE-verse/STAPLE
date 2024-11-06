import Table from "src/core/components/Table"
import { RoleTableColumns } from "../tables/columns/RoleTableColumns"
import { processRoleTableData } from "../tables/processing/processRoleTableData"
import { Role } from "db"

interface AllRolesListProps {
  roles: Role[]
  onRolesChanged?: () => void
  taxonomyList: string[]
}

export const AllRolesList = ({ roles, onRolesChanged, taxonomyList }: AllRolesListProps) => {
  // Process table data
  const roleTableData = processRoleTableData(roles, onRolesChanged, taxonomyList)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={RoleTableColumns} data={roleTableData} addPagination={true} />
    </main>
  )
}

import Table from "src/core/components/Table"
import { RoleTableColumns } from "../tables/columns/RoleTableColumns"
import { processRoleTableData } from "../tables/processing/processRoleTableData"
import { Role } from "db"
import { PaginationState, OnChangeFn } from "@tanstack/react-table"

interface AllRolesListProps {
  roles: Role[]
  onRolesChanged?: () => void
  taxonomyList: string[]
  manualPagination?: boolean
  paginationState?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  pageSizeOptions?: number[]
}

export const AllRolesList = ({
  roles,
  onRolesChanged,
  taxonomyList,
  manualPagination = false,
  paginationState,
  onPaginationChange,
  pageCount,
  pageSizeOptions,
}: AllRolesListProps) => {
  // Process table data
  const roleTableData = processRoleTableData(roles, onRolesChanged, taxonomyList)

  return (
    <main className="flex flex-col mx-auto w-full">
      <Table
        columns={RoleTableColumns}
        data={roleTableData}
        addPagination={true}
        manualPagination={manualPagination}
        paginationState={paginationState}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        pageSizeOptions={pageSizeOptions}
      />
    </main>
  )
}

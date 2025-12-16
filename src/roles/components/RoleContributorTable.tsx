import Table from "src/core/components/Table"
import { useRoleContributorTableColumns } from "../tables/columns/RoleContributorTableColumns"
import { PaginationState, OnChangeFn } from "@tanstack/react-table"

type RoleContributorTableProps = {
  contributors: any[]
  manualPagination?: boolean
  paginationState?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  pageSizeOptions?: number[]
}

export const RoleContributorTable = ({
  contributors,
  manualPagination = false,
  paginationState,
  onPaginationChange,
  pageCount,
  pageSizeOptions,
}: RoleContributorTableProps) => {
  const processedData = contributors.map((contributor) => ({
    username: contributor.users[0].username,
    firstname: contributor.users[0].firstName,
    lastname: contributor.users[0].lastName,
    id: contributor.id,
    roleNames: contributor.roles ? contributor.roles.map((role) => role.name).join(", ") : "",
  }))

  const columns = useRoleContributorTableColumns(processedData)

  return (
    <Table
      columns={columns}
      data={processedData}
      addPagination={true}
      manualPagination={manualPagination}
      paginationState={paginationState}
      onPaginationChange={onPaginationChange}
      pageCount={pageCount}
      pageSizeOptions={pageSizeOptions}
    />
  )
}

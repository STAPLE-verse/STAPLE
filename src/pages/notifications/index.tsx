import { Suspense, useMemo, useState } from "react"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getNotifications from "src/notifications/queries/getNotifications"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useNotificationTableColumns } from "src/notifications/tables/columns/NotificationColumns"
import {
  ExtendedNotification,
  processNotification,
} from "src/notifications/tables/processing/processNotification"
import { MultiSelectProvider, useMultiSelect } from "src/core/components/fields/MultiSelectContext"
import { DeleteNotificationButton } from "src/notifications/components/DeleteNotificationButton"
import { MultiReadToggleButton } from "src/notifications/components/MultiReadToggleButton"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"
import { PaginationState } from "@tanstack/react-table"
import { Prisma } from "db"

const NotificationContent = () => {
  const currentUser = useCurrentUser()
  const {
    selectedIds,
    resetSelection,
    isGlobalSelection,
    enableGlobalSelection,
    disableGlobalSelection,
  } = useMultiSelect()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const baseWhere = useMemo<Prisma.NotificationWhereInput>(
    () => ({
      recipients: {
        some: {
          id: currentUser!.id,
        },
      },
      // Only include notifications for projects where the contributor is not deleted
      project: {
        projectMembers: {
          some: {
            users: {
              some: { id: currentUser!.id },
            },
            name: null, // Contributor (indicating it's not a team)
            deleted: false, // Only include undeleted project members
          },
        },
      },
    }),
    [currentUser]
  )

  const paginationArgs = useMemo(
    () => ({
      skip: pagination.pageIndex * pagination.pageSize,
      take: pagination.pageSize,
    }),
    [pagination]
  )

  // Get notifications
  const [{ notifications, count }, { refetch }] = usePaginatedQuery(getNotifications, {
    where: baseWhere,
    orderBy: { createdAt: "desc" },
    include: { project: true },
    ...paginationArgs,
  })

  const extendedNotifications = notifications as unknown as ExtendedNotification[]

  // Preprocess table data
  const notificationTableData = useMemo(
    () => processNotification(extendedNotifications),
    [extendedNotifications]
  )

  // Get columns and pass refetch
  const columns = useNotificationTableColumns(refetch, notificationTableData)

  const selectedNotifications = extendedNotifications.filter((n) => selectedIds.includes(n.id))
  const allPageIds = useMemo(
    () => notificationTableData.map((item) => item.id),
    [notificationTableData]
  )

  const isPageFullySelected =
    !isGlobalSelection &&
    allPageIds.length > 0 &&
    allPageIds.every((id) => selectedIds.includes(id))
  const totalSelectedCount = isGlobalSelection ? count : selectedIds.length
  const selectionMode: "ids" | "all" = isGlobalSelection ? "all" : "ids"
  const pageCount = Math.max(1, Math.ceil(count / pagination.pageSize))

  const handlePaginationChange = (
    updater: PaginationState | ((state: PaginationState) => PaginationState)
  ) => {
    setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
    disableGlobalSelection()
  }

  const handleActionCompleted = async () => {
    await refetch()
    resetSelection()
  }

  return (
    <main className="flex flex-col mx-auto w-full">
      <h1 className="flex justify-center items-center text-3xl">
        Notifications
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="dashboard-overview"
        />
        <Tooltip
          id="dashboard-overview"
          content="This page shows all your notifications. You can mark them as read or click on a link to view the related item. Use the last column to select multiple notifications at once."
          className="z-[1099] ourtooltips"
        />
      </h1>

      <div className="flex justify-center mb-2 mt-4 gap-2">
        <DeleteNotificationButton
          ids={selectedIds}
          where={baseWhere}
          selectionMode={selectionMode}
          totalSelectedCount={totalSelectedCount}
          onCompleted={handleActionCompleted}
        />
        <MultiReadToggleButton
          notifications={selectedNotifications}
          refetch={refetch}
          resetSelection={resetSelection}
          selectionMode={selectionMode}
          totalSelectedCount={totalSelectedCount}
          where={baseWhere}
        />
      </div>
      <Card title={""}>
        {isPageFullySelected && count > allPageIds.length && (
          <div className="alert alert-info mb-2 flex justify-between items-center">
            <span className="text-md">
              All {allPageIds.length} notifications on this page are selected. You can select every
              notification in your inbox.
            </span>
            <button className="btn text-base text-md" onClick={enableGlobalSelection}>
              Select all {count} notifications
            </button>
          </div>
        )}
        {isGlobalSelection && count > 0 && (
          <div className="alert alert-info mb-2 flex justify-between items-center">
            <span className="text-md">All {count} notifications are selected.</span>
            <button className="btn text-base text-md" onClick={resetSelection}>
              Clear selection
            </button>
          </div>
        )}
        <Table
          columns={columns}
          data={notificationTableData}
          addPagination={true}
          manualPagination={true}
          paginationState={pagination}
          onPaginationChange={handlePaginationChange}
          pageCount={pageCount}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Card>
    </main>
  )
}
const NotificationsPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="All Notifications">
      <Suspense fallback={<div>Loading...</div>}>
        <MultiSelectProvider>
          <NotificationContent />
        </MultiSelectProvider>
      </Suspense>
    </Layout>
  )
}

export default NotificationsPage

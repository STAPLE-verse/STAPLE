import { Suspense, useMemo, useState } from "react"
import Layout from "src/core/layouts/Layout"
import Table from "src/core/components/Table"
import { useParam } from "@blitzjs/next"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getNotifications from "src/notifications/queries/getNotifications"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useProjectNotificationTableColumns } from "src/notifications/tables/columns/ProjectNotificationTableColumns"
import { ExtendedNotification } from "src/notifications/tables/processing/processNotification"
import { processProjectNotification } from "src/notifications/tables/processing/processProjectNotification"
import { MultiSelectProvider, useMultiSelect } from "src/core/components/fields/MultiSelectContext"
import { DeleteNotificationButton } from "src/notifications/components/DeleteNotificationButton"
import { MultiReadToggleButton } from "src/notifications/components/MultiReadToggleButton"
import Card from "src/core/components/Card"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import { PaginationState } from "@tanstack/react-table"
import { Prisma } from "db"

const NotificationContent = () => {
  const projectId = useParam("projectId", "number")
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
      projectId: projectId ?? undefined,
    }),
    [currentUser?.id, projectId]
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
  const projectNotificationTableData = useMemo(
    () => processProjectNotification(extendedNotifications),

    [extendedNotifications]
  )

  // Get columns and pass refetch
  const columns = useProjectNotificationTableColumns(refetch, projectNotificationTableData)

  const selectedNotifications = extendedNotifications.filter((n) => selectedIds.includes(n.id))
  const allPageIds = useMemo(
    () => projectNotificationTableData.map((item) => item.id),
    [projectNotificationTableData]
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
      <div className="flex justify-center items-center gap-2">
        <h1 className="text-3xl">Project Notifications</h1>
        <InformationCircleIcon
          className="h-5 w-5 stroke-2 text-info"
          data-tooltip-id="project-notifications-tooltip"
        />
        <Tooltip
          id="project-notifications-tooltip"
          content="These are notifications for this project only. You can delete or mark them as read using the select options."
          className="z-[1099] ourtooltips"
        />
      </div>
      <div className="flex justify-center mt-4 mb-2 gap-2">
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
      <Card title="">
        {isPageFullySelected && count > allPageIds.length && (
          <div className="alert alert-info mb-2 flex justify-between items-center">
            <span className="text-md">
              All {allPageIds.length} notifications on this page are selected. You can select every
              notification for this project.
            </span>
            <button className="btn text-base text-md" onClick={enableGlobalSelection}>
              Select all {count} notifications
            </button>
          </div>
        )}
        {isGlobalSelection && count > 0 && (
          <div className="alert alert-info mb-2 flex justify-between items-center">
            <span className="text-md">All {count} project notifications are selected.</span>
            <button className="btn text-base text-md" onClick={resetSelection}>
              Clear selection
            </button>
          </div>
        )}
        <Table
          columns={columns}
          data={projectNotificationTableData}
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

const ProjectNotificationsPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Project Notifications">
      <Suspense fallback={<div>Loading...</div>}>
        <MultiSelectProvider>
          <NotificationContent />
        </MultiSelectProvider>
      </Suspense>
    </Layout>
  )
}

export default ProjectNotificationsPage

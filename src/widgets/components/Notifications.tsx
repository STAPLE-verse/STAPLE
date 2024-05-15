import React from "react"
import { useQuery } from "@blitzjs/rpc"
import getNotifications from "src/messages/queries/getNotifications"
import Table from "src/core/components/Table"
import { notificationColumns } from "./ColumnHelpers"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

const Notifications = ({ currentUser }) => {
  const [{ notifications }, { isLoading }] = useQuery(getNotifications, {
    where: {
      recipients: { some: { id: currentUser!.id } },
      read: false,
    },
    orderBy: { id: "desc" },
    take: 3,
  })

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  if (notifications.length === 0) return <p className="italic p-2">No unread notifications</p>

  return (
    <>
      <div className="card-body">
        <div className="card-title text-base-content">Notifications</div>
        <Table
          columns={notificationColumns}
          data={notifications}
          classNames={{
            thead: "text-sm text-base-content",
            tbody: "text-sm text-base-content",
            td: "text-sm text-base-content",
          }}
        />
      </div>
      <div className="card-actions justify-end">
        {" "}
        <Link className="btn btn-primary self-end m-4" href={Routes.NotificationsPage()}>
          {" "}
          Show all notifications{" "}
        </Link>
      </div>
    </>
  )
}

export default Notifications

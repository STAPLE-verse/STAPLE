import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { Notification, Project } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getNotifications from "../queries/getNotifications"
import useCountNotifications, { NotificationCounts } from "../hooks/useCountNotifications"
import { useParam } from "@blitzjs/next"

export type ExtendedNotification = Notification & {
  project: Project
}

interface NotificationContextType {
  notifications: Notification[]
  count: NotificationCounts
  refetch: () => void
  page: number
  hasMore: boolean
  goToPreviousPage: () => void
  goToNextPage: () => void
}

const ITEMS_PER_PAGE = 10

const NotificationContext = createContext<NotificationContextType | null>(null)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [page, setPage] = useState(0)
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  const whereClause = {
    recipients: {
      some: {
        id: currentUser?.id,
      },
    },
    ...(projectId ? { projectId } : {}),
  }

  const [{ notifications, hasMore }, { refetch }] = usePaginatedQuery(getNotifications, {
    where: whereClause,
    include: { project: true },
    orderBy: [
      { read: "asc" }, // Show unread notifications first
      { id: "asc" }, // Then sort by id
    ],
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const count = useCountNotifications(notifications)

  const goToPreviousPage = () => setPage((prevPage) => Math.max(prevPage - 1, 0))
  const goToNextPage = () => setPage((prevPage) => (hasMore ? prevPage + 1 : prevPage))

  useEffect(() => {
    setPage(0)
  }, [projectId])

  return (
    <NotificationContext.Provider
      value={{ notifications, count, refetch, page, hasMore, goToPreviousPage, goToNextPage }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

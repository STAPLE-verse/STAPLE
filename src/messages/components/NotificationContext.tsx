import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react"
import { Notification, Project } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import getNotifications from "../queries/getNotifications"
import { useParam } from "@blitzjs/next"
import getUnreadNotificationsCount from "../queries/getUnreadNotificationsCount"

export type ExtendedNotification = Notification & {
  project: Project
}

export interface NotificationCounts {
  all: number
  unread: number
}

interface NotificationContextType {
  notifications: Notification[]
  notificationCount: NotificationCounts
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

  const [{ notifications = [], hasMore = false } = {}, { refetch: refetchNotifications }] =
    usePaginatedQuery(
      getNotifications,
      {
        where: whereClause,
        include: { project: true },
        orderBy: [
          { read: "asc" }, // Show unread notifications first
          { id: "asc" }, // Then sort by id
        ],
        skip: ITEMS_PER_PAGE * page,
        take: ITEMS_PER_PAGE,
      },
      {
        enabled: !!currentUser,
      }
    )

  // Fetch unread notifications count
  const [{ totalCount = 0, unreadCount = 0 } = {}, { refetch: refetchUnreadCount }] = useQuery(
    getUnreadNotificationsCount,
    {
      where: {
        recipients: {
          some: {
            id: currentUser?.id,
          },
        },
      },
    },
    { enabled: !!currentUser }
  )

  const notificationCount = { all: totalCount, unread: unreadCount }

  const goToPreviousPage = () => setPage((prevPage) => Math.max(prevPage - 1, 0))
  const goToNextPage = () => setPage((prevPage) => (hasMore ? prevPage + 1 : prevPage))

  useEffect(() => {
    setPage(0)
  }, [projectId])

  const refetchAll = useCallback(async () => {
    await refetchNotifications()
    await refetchUnreadCount()
  }, [refetchNotifications, refetchUnreadCount])

  if (!currentUser) {
    return <>{children}</>
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        notificationCount,
        refetch: refetchAll,
        page,
        hasMore,
        goToPreviousPage,
        goToNextPage,
      }}
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

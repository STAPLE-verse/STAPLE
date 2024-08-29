import { useQuery, useMutation } from "@blitzjs/rpc"
import { ReactNode, useEffect, useMemo, useState } from "react"
import getUserWidgets from "src/widgets/queries/getUserWidgets"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"
import setWidgets from "src/widgets/mutations/setWidgets"
import toast from "react-hot-toast"
import { constructWidget } from "../utils/constructWidget"

export type WidgetObject = {
  id: number
  title: string
  display: ReactNode
  link: ReactNode
  position: number
  size: string | null
  tooltipId: string
  tooltipContent: string
}

export default function useMainPageData(userId: number) {
  const [setWidgetMutation] = useMutation(setWidgets)

  const [boxes, setBoxes] = useState<WidgetObject[]>([])

  // Fetch data
  const [{ upcomingTasks, pastDueTasks }] = useQuery(getDashboardTasks, undefined)
  const [{ projects }] = useQuery(getDashboardProjects, undefined)
  const [{ notifications }] = useQuery(getLatestUnreadNotifications, {})
  const [fetchedWidgets] = useQuery(getUserWidgets, {
    userId: userId,
  })

  // Transform and set the data for boxes
  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      const sortedWidgets = fetchedWidgets.sort((a, b) => a.position - b.position)
      const updatedBoxes = sortedWidgets.map((widget) =>
        constructWidget({ widget, projects, notifications, pastDueTasks, upcomingTasks })
      )
      setBoxes(updatedBoxes)
    } else {
      setWidgetMutation({ id: userId })
        .then(() => {
          toast.success(`Added dashboard, please refresh!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [
    fetchedWidgets,
    projects,
    notifications,
    pastDueTasks,
    upcomingTasks,
    setWidgetMutation,
    userId,
  ])

  return { boxes, setBoxes }
}

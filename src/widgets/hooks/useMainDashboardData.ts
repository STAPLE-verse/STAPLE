import { useQuery, useMutation } from "@blitzjs/rpc"
import { ReactNode, useEffect, useState } from "react"
import getUserWidgets from "src/widgets/queries/getUserWidgets"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"
import setWidgets from "src/widgets/mutations/setWidgets"
import toast from "react-hot-toast"
import { constructWidget } from "../utils/constructWidget"
import { sortWidgets } from "../utils/sortWidgets"

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

export default function useMainPageData(userId: number): {
  boxes: WidgetObject[]
  setBoxes: React.Dispatch<React.SetStateAction<WidgetObject[]>>
} {
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
      const sortedWidgets = sortWidgets(fetchedWidgets)
      const updatedBoxes = sortedWidgets.map((widget) =>
        constructWidget({ widget, projects, notifications, pastDueTasks, upcomingTasks })
      )
      setBoxes(updatedBoxes)
    } else {
      setWidgetMutation(userId)
        .then((createdWidgets) => {
          const updatedBoxes = createdWidgets.map((widget) =>
            constructWidget({ widget, projects, notifications, pastDueTasks, upcomingTasks })
          )
          setBoxes(updatedBoxes)
          toast.success(`Dashboard added successfully!`)
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

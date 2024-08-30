import { useQuery } from "@blitzjs/rpc"
import getDashboardTasks from "src/tasks/queries/getDashboardTasks"
import getDashboardProjects from "src/projects/queries/getDashboardProjects"
import getLatestUnreadNotifications from "src/notifications/queries/getLatestUnreadNotifications"

export default function useMainPageData() {
  const [{ upcomingTasks, pastDueTasks }] = useQuery(getDashboardTasks, undefined)
  const [{ projects }] = useQuery(getDashboardProjects, undefined)
  const [{ notifications }] = useQuery(getLatestUnreadNotifications, {})

  return { projects, notifications, pastDueTasks, upcomingTasks }
}

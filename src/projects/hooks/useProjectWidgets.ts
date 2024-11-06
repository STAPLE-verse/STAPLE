import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import getProjectWidgets from "src/widgets/queries/getProjectWidgets"
import initializeProjectWidgets from "src/widgets/mutations/initializeProjectWidgets"
import { MemberPrivileges } from "db"
import { sortWidgets } from "src/widgets/utils/sortWidgets"

interface UseProjectWidgetsProps {
  userId: number
  projectId: number
  privilege: MemberPrivileges
}

export const useProjectWidgets = ({ userId, projectId, privilege }: UseProjectWidgetsProps) => {
  const [widgets, setWidgets] = useState<any[]>([])
  const [initializeWidgetsMutation] = useMutation(initializeProjectWidgets)
  const [fetchedWidgets] = useQuery(getProjectWidgets, { userId, projectId })

  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      setWidgets(sortWidgets(fetchedWidgets))
    } else {
      initializeWidgetsMutation({ userId, projectId, privilege })
        .then((createdWidgets) => {
          setWidgets(createdWidgets)
          toast.success("Dashboard initialized successfully!")
        })
        .catch(() => {
          toast.error("Error initializing dashboard. Please contact support.")
        })
    }
  }, [fetchedWidgets, initializeWidgetsMutation, privilege, projectId, userId])

  return { widgets, setWidgets }
}

import { useEffect, useState } from "react"
import { sortWidgets } from "../utils/sortWidgets"
import { useMutation, useQuery } from "@blitzjs/rpc"
import setWidgets from "src/widgets/mutations/setWidgets"
import toast from "react-hot-toast"
import { Widget } from "db"
import getUserWidgets from "../queries/getUserWidgets"

export default function useWidgets(userId: number): {
  widgets: Widget[]
  setWidgetsState: React.Dispatch<React.SetStateAction<Widget[]>>
} {
  const [widgets, setWidgetsState] = useState<Widget[]>([])
  const [fetchedWidgets] = useQuery(getUserWidgets, { userId: userId })
  const [setWidgetMutation] = useMutation(setWidgets)

  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      const sortedWidgets = sortWidgets(fetchedWidgets)
      setWidgetsState(sortedWidgets)
    } else {
      setWidgetMutation(userId)
        .then((createdWidgets) => {
          setWidgetsState(createdWidgets)
          toast.success(`Dashboard added successfully!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [fetchedWidgets, setWidgetMutation, userId])

  return { widgets, setWidgetsState }
}

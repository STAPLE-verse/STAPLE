import { useEffect, useState } from "react"
import { sortWidgets } from "../utils/sortWidgets"
import { useMutation, useQuery } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import { Widget } from "db"
import getUserWidgets from "../queries/getUserWidgets"
import initializeWidgets from "../mutations/initializeWidgets"

export default function useWidgets(userId: number): {
  widgets: Widget[]
  setWidgets: React.Dispatch<React.SetStateAction<Widget[]>>
} {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [fetchedWidgets] = useQuery(getUserWidgets, { userId: userId })
  const [setWidgetMutation] = useMutation(initializeWidgets)

  useEffect(() => {
    if (fetchedWidgets.length > 0) {
      const sortedWidgets = sortWidgets(fetchedWidgets)
      setWidgets(sortedWidgets)
    } else {
      setWidgetMutation(userId)
        .then((createdWidgets) => {
          setWidgets(createdWidgets)
          toast.success(`Dashboard added successfully!`)
        })
        .catch(() => {
          toast.error(`Issue with dashboard, please contact help.`)
        })
    }
  }, [fetchedWidgets, setWidgetMutation, userId])

  return { widgets, setWidgets }
}

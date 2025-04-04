import { useCallback, useEffect, useState } from "react"
import { getBreadcrumbLabel } from "../utils/getBreadcrumbLabel"
import { BreadcrumbEntityType } from "../types"

export function useBreadcrumbNames(pathSegments: string[]) {
  const [names, setNames] = useState<Record<string, string>>({})

  const fetchLabel = useCallback(
    async (type: BreadcrumbEntityType, id: string) => {
      if (names[id]) return

      try {
        const label = await getBreadcrumbLabel(type, Number(id))
        setNames((prev) => ({ ...prev, [id]: label }))
      } catch (e) {
        console.warn("Could not fetch breadcrumb name for", id)
      }
    },
    [names]
  )

  useEffect(() => {
    pathSegments.forEach((segment, index) => {
      const prev = pathSegments[index - 1]
      if (prev === "projects") void fetchLabel("project", segment)
      else if (prev === "tasks") void fetchLabel("task", segment)
      else if (prev === "elements") void fetchLabel("element", segment)
      else if (prev === "teams") void fetchLabel("team", segment)
      else if (prev === "contributors") void fetchLabel("contributor", segment)
    })
  }, [pathSegments, fetchLabel])

  return names
}

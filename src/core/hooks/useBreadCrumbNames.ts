import { useCallback, useEffect, useRef, useState } from "react"
import { BreadcrumbEntityType } from "../types"
import getBreadcrumbLabel from "../queries/getBreadcrumbLabel"
import { invoke } from "@blitzjs/rpc"

export const segmentToTypeMap: Record<string, BreadcrumbEntityType> = {
  projects: "project",
  tasks: "task",
  elements: "element",
  teams: "team",
  contributors: "contributor",
}

export function useBreadcrumbNames(pathSegments: string[]) {
  // Now the keys are like "project:1", "task:99"
  const [names, setNames] = useState<Record<string, string>>({})
  const seenKeys = useRef(new Set<string>())

  const fetchLabel = useCallback(async (type: BreadcrumbEntityType, id: string) => {
    const key = `${type}:${id}`
    if (seenKeys.current.has(key)) return
    seenKeys.current.add(key)

    try {
      const label = await invoke(getBreadcrumbLabel, {
        type,
        id: parseInt(id, 10),
      })

      setNames((prev) => ({
        ...prev,
        [key]: typeof label === "string" ? label : "Unknown",
      }))
    } catch (e) {
      console.warn("Could not fetch breadcrumb name for", key)
    }
  }, [])

  useEffect(() => {
    const tasks = pathSegments.map(async (segment, index) => {
      const prev = pathSegments[index - 1]
      if (!prev) return

      const type = segmentToTypeMap[prev]
      if (type) void fetchLabel(type, segment)
    })

    void Promise.all(tasks)
  }, [pathSegments, fetchLabel])

  return names
}

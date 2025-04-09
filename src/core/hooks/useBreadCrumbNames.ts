import { useCallback, useEffect, useRef, useState } from "react"
import { BreadcrumbEntityType } from "../types"
import getBreadcrumbLabel from "../queries/getBreadcrumbLabel"
import { invoke } from "@blitzjs/rpc"
import { useBreadcrumbCache } from "../components/BreadcrumbCacheContext"

export const segmentToTypeMap: Record<string, BreadcrumbEntityType> = {
  projects: "project",
  tasks: "task",
  elements: "element",
  teams: "team",
  contributors: "contributor",
  forms: "form",
}

export function useBreadcrumbNames(pathSegments: string[]) {
  // We are using composity keys of the type and the id: "project:1", "task:99"
  const { names, setName } = useBreadcrumbCache()
  const seenKeys = useRef(new Set<string>())

  const fetchLabel = useCallback(
    async (type: BreadcrumbEntityType, id: string) => {
      const key = `${type}:${id}`
      if (seenKeys.current.has(key) || names[key]) return

      seenKeys.current.add(key)

      try {
        const label = await invoke(getBreadcrumbLabel, {
          type,
          id: parseInt(id, 10),
        })
        if (label) setName(key, label)
      } catch (e) {
        console.warn("Could not fetch breadcrumb name for", key)
      }
    },
    [names, setName]
  )

  useEffect(() => {
    pathSegments.forEach((segment, index) => {
      const prev = pathSegments[index - 1]
      if (!prev) return
      const type = segmentToTypeMap[prev]
      if (type && /^\d+$/.test(segment)) void fetchLabel(type, segment)
    })
  }, [pathSegments, fetchLabel])

  return names
}

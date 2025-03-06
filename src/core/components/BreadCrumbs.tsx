import { useRouter } from "next/router"
import Link from "next/link"
import { invoke } from "@blitzjs/rpc"
import getProject from "src/projects/queries/getProject"
import getTask from "src/tasks/queries/getTask"
import { useState, useEffect, useCallback } from "react"
import getElement from "src/elements/queries/getElement"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import getTeam from "src/teams/queries/getTeam"

export const Breadcrumbs = () => {
  const router = useRouter()
  const pathSegments = router.asPath.split("/").filter((segment) => segment)
  const [namesCache, setNamesCache] = useState<Record<string, string>>({})

  // ✅ Use useCallback to prevent unnecessary re-renders
  const fetchNameIfNeeded = useCallback(
    async (type: "project" | "task" | "element" | "team" | "contributor", id: string) => {
      if (namesCache[id]) {
        console.log(`[CACHE] Using cached ${type} name for ID ${id}:`, namesCache[id])
        return // Use cached name if available
      }

      try {
        let data
        console.log(`[FETCH] Requesting ${type} name for ID ${id}`)

        if (type === "project") {
          data = await invoke(getProject, { id: parseInt(id, 10) }) // No ctx needed
        } else if (type === "task") {
          data = await invoke(getTask, { id: parseInt(id, 10) }) // No ctx needed
        } else if (type == "element") {
          data = await invoke(getElement, { id: parseInt(id, 10) }) // No ctx needed
        } else if (type == "team") {
          data = await invoke(getTeam, { id: parseInt(id, 10) }) // No ctx needed
        } else if (type == "contributor") {
          data = await invoke(getProjectMember, {
            where: { id: parseInt(id, 10) },
            include: { users: true },
          })
          console.log(`[API RESPONSE] ProjectMember Data for ID ${id}:`, data)

          if (data && data.users.length > 0) {
            const user = data.users[0]
            const fullName =
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username || "Unknown"
            data = { name: fullName } // Reshape data to match the expected format
          } else {
            console.warn(`[WARNING] No valid user found for ProjectMember ID ${id}`)
          }
        }

        if (data?.name) {
          console.log(`[UPDATE] Storing ${type} name for ID ${id}:`, data.name)
          setNamesCache((prev) => ({ ...prev, [id]: data.name })) // Store in cache
        } else {
          console.error(`[ERROR] No valid name found in response for ${type} ID ${id}`, data)
        }
      } catch (error) {
        console.error(`[ERROR] Failed to fetch ${type} name for ID ${id}:`, error)
      }
    },
    [namesCache]
  ) // ✅ Only re-create when namesCache changes

  useEffect(() => {
    pathSegments.forEach((segment, index) => {
      const prevSegment = pathSegments[index - 1]
      if (prevSegment === "projects" && !isNaN(Number(segment))) {
        void fetchNameIfNeeded("project", segment)
      } else if (prevSegment === "tasks" && !isNaN(Number(segment))) {
        void fetchNameIfNeeded("task", segment)
      } else if (prevSegment === "elements" && !isNaN(Number(segment))) {
        void fetchNameIfNeeded("element", segment)
      } else if (prevSegment === "teams" && !isNaN(Number(segment))) {
        void fetchNameIfNeeded("team", segment)
      } else if (prevSegment === "contributors" && !isNaN(Number(segment))) {
        void fetchNameIfNeeded("contributor", segment)
      }
    })
  }, [pathSegments, fetchNameIfNeeded]) // ✅ Now fetchNameIfNeeded is properly included

  // Function to truncate long names with "..."
  const truncateLabel = (label: string, maxLength: number = 20) => {
    return label.length > maxLength ? label.substring(0, maxLength) + "..." : label
  }

  // Generate breadcrumb objects
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const prevSegment = pathSegments[index - 1]

    let label = decodeURIComponent(segment).replace(/[-_]/g, " ")
    if (prevSegment === "projects" && namesCache[segment]) {
      label = namesCache[segment] // Use cached project name
    } else if (prevSegment === "tasks" && namesCache[segment]) {
      label = namesCache[segment] // Use cached task name
    } else if (prevSegment === "elements" && namesCache[segment]) {
      label = namesCache[segment] // Use cached task name
    } else if (prevSegment === "teams" && namesCache[segment]) {
      label = namesCache[segment] // Use cached task name
    } else if (prevSegment === "contributors" && namesCache[segment]) {
      label = namesCache[segment] // Use cached task name
    } else {
      label = label.replace(/\b\w/g, (char) => char.toUpperCase()) // Proper Case
    }

    // Truncate long names
    label = truncateLabel(label, 20)

    return {
      label,
      href,
      isLast: index === pathSegments.length - 1,
    }
  })

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/main" className="hover:underline">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            {crumb.isLast ? (
              <span className="font-bold text-base-content">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useRouter } from "next/router"
import { BreadcrumbList } from "src/core/components/BreadcrumbList"
import { useBreadcrumbNames } from "../hooks/useBreadCrumbNames"
import { BreadcrumbLabel } from "./BreadcrumbLabel"
import { getAllValidRoutes } from "../utils/getAllValidRoutes"
import { match } from "path-to-regexp"

const validPatterns = getAllValidRoutes()

export const isValidPath = (href: string): boolean => {
  return validPatterns.some((pattern) => {
    try {
      return match(pattern)(href)
    } catch (e) {
      console.warn("Invalid pattern:", pattern)
      return false
    }
  })
}

export const Breadcrumbs = () => {
  const router = useRouter()
  const pathSegments = router.asPath.split("/").filter(Boolean)
  const namesCache = useBreadcrumbNames(pathSegments)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const prev = pathSegments[index - 1]

    return {
      label: <BreadcrumbLabel segment={segment} prevSegment={prev} namesCache={namesCache} />,
      href,
      isLast: index === pathSegments.length - 1,
      isValid: isValidPath(href),
    }
  })

  return (
    <div className="text-md breadcrumbs">
      <BreadcrumbList items={breadcrumbs} />
    </div>
  )
}

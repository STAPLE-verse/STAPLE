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

  // drop any querystring before splitting
  const rawPath = router.asPath ?? ""
  const basePath = rawPath.split("?")[0] || ""
  const pathSegments = basePath.split("/").filter((seg) => seg.length > 0)

  const namesCache = useBreadcrumbNames(pathSegments)
  const breadcrumbs = pathSegments.map((segment, index) => {
    // build the href without any query
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

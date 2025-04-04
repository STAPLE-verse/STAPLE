import { useRouter } from "next/router"
import { BreadcrumbList } from "src/core/components/BreadcrumbList"
import { useBreadcrumbNames } from "../hooks/useBreadCrumbNames"

export const Breadcrumbs = () => {
  const router = useRouter()
  const pathSegments = router.asPath.split("/").filter(Boolean)
  const namesCache = useBreadcrumbNames(pathSegments)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const prev = pathSegments[index - 1]

    const cachedLabel = namesCache[segment]
    let label =
      cachedLabel ?? segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

    return {
      label: label.length > 20 ? label.slice(0, 20) + "..." : label,
      href,
      isLast: index === pathSegments.length - 1,
    }
  })

  return (
    <div className="text-md breadcrumbs">
      <BreadcrumbList items={breadcrumbs} />
    </div>
  )
}

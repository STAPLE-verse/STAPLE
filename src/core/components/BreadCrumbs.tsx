import { useRouter } from "next/router"
import Link from "next/link"

export const Breadcrumbs = () => {
  const router = useRouter()
  const pathSegments = router.asPath.split("/").filter((segment) => segment)

  // Generate breadcrumb objects
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const label = decodeURIComponent(segment).replace(/[-_]/g, " ").toUpperCase()

    return {
      label: label || "Home",
      href: href,
      isLast: index === pathSegments.length - 1,
    }
  })

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={index}>
            {crumb.isLast ? (
              // Render the last breadcrumb as bold text without a link
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

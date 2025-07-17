import Link from "next/link"
import DOMPurify from "dompurify"
import { isRouteData } from "../utils/isRouteData"
import { RouteData } from "src/core/types"

interface NotificatioMessageProps {
  message: string
  routeData: RouteData | null
}

export default function NotificatioMessage({ message, routeData }: NotificatioMessageProps) {
  const cleanMessage = DOMPurify.sanitize(message)

  return isRouteData(routeData) ? (
    <Link
      href={{
        pathname: routeData.path,
        query: routeData.params,
      }}
      className="hover:underline text-primary text-lg"
    >
      <div dangerouslySetInnerHTML={{ __html: cleanMessage }}></div>
    </Link>
  ) : (
    <div dangerouslySetInnerHTML={{ __html: cleanMessage }}></div>
  )
}

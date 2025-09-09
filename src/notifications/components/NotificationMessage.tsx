import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import Link from "next/link"
import DOMPurify from "dompurify"
import { isRouteData } from "../utils/isRouteData"
import { RouteData } from "src/core/types"

interface NotificatioMessageProps {
  message: string
  routeData: RouteData | null
  isMarkdown?: boolean
}

export default function NotificatioMessage({
  message,
  routeData,
  isMarkdown,
}: NotificatioMessageProps) {
  const cleanMessage = DOMPurify.sanitize(message)

  if (isMarkdown) {
    const content = (
      <div className="markdown-display">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              />
            ),
          }}
        >
          {message || ""}
        </ReactMarkdown>
      </div>
    )

    return isRouteData(routeData) ? (
      <Link
        href={{
          pathname: routeData.path,
          query: routeData.params,
        }}
        className="hover:underline text-primary text-lg"
      >
        {content}
      </Link>
    ) : (
      content
    )
  }

  // non-markdown fallback
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

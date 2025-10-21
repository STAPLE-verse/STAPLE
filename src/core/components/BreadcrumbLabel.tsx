import { segmentToTypeMap } from "../hooks/useBreadCrumbNames"
import { useTranslation } from "react-i18next"

const isNumeric = (value: string) => /^\d+$/.test(value)

export const BreadcrumbLabel = ({
  segment,
  prevSegment,
  namesCache,
  maxLength = 40,
}: {
  segment: string
  prevSegment?: string
  namesCache: Record<string, string>
  maxLength?: number
}) => {
  const type = prevSegment ? segmentToTypeMap[prevSegment] : undefined
  const fallback = segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  const { t } = (useTranslation as any)()

  const isDynamic = type && isNumeric(segment)
  const compositeKey = type ? `${type}:${segment}` : segment
  const label = namesCache[compositeKey]

  // If there is a cached/dynamic label, use it as-is. Otherwise translate known static segments.
  const displayLabel =
    label ?? t(`breadcrumbs.${segment.toLowerCase()}`, { defaultValue: fallback })
  const truncated =
    displayLabel.length > maxLength ? displayLabel.slice(0, maxLength) + "..." : displayLabel

  return (
    <span
      aria-label={displayLabel}
      title={displayLabel}
      className={label || !isDynamic ? "" : "skeleton h-4 w-20 inline-block rounded"}
    >
      {label || !isDynamic ? truncated : null}
    </span>
  )
}

import { ReactNode } from "react"
import clsx from "clsx"
import { v4 as uuidv4 } from "uuid"
import TooltipWrapper from "./TooltipWrapper"

interface CollapseCardProps {
  title: string
  children?: ReactNode
  tooltipContent?: string
  actions?: ReactNode
  className?: string
}

const CollapseCard = ({
  title,
  children,
  tooltipContent,
  actions,
  className,
}: CollapseCardProps) => {
  // Generate a unique ID if tooltipContent is provided
  const tooltipId = tooltipContent ? uuidv4() : undefined

  return (
    <div className={clsx("collapse collapse-arrow bg-base-300 p-2 overflow-visible", className)}>
      <input type="checkbox" data-tooltip-id={tooltipId} />
      <div className="collapse-title text-xl font-medium">
        <div className="card-title">{title}</div>
        {tooltipContent && (
          <TooltipWrapper
            id={tooltipId}
            content={tooltipContent}
            className="z-[1099] ourtooltips"
          />
        )}
      </div>

      <div className="collapse-content mb-4">
        {children}
        <div className="justify-end absolute bottom-2 right-6">{actions}</div>
      </div>
    </div>
  )
}

export default CollapseCard

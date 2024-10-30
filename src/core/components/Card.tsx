import { ReactNode } from "react"
import { Tooltip } from "react-tooltip"
import clsx from "clsx"
import { v4 as uuidv4 } from "uuid"

interface CardProps {
  title: string
  children: ReactNode
  tooltipContent?: string
  actions?: ReactNode
  className?: string
}

const Card = ({ title, children, tooltipContent, actions, className }: CardProps) => {
  // Generate a unique ID if tooltipContent is provided
  const tooltipId = tooltipContent ? uuidv4() : undefined

  return (
    <div className={clsx("card bg-base-300 w-full mt-2", className)}>
      <div className="card-body">
        <div className="card-title" data-tooltip-id={tooltipId}>
          {title}
        </div>
        {tooltipContent && (
          <Tooltip id={tooltipId} content={tooltipContent} className="z-[1099] ourtooltips" />
        )}
        {children}
        {actions && <div className="card-actions justify-end">{actions}</div>}
      </div>
    </div>
  )
}

export default Card

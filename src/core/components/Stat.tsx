import React, { ReactNode } from "react"
import clsx from "clsx"
import { v4 as uuidv4 } from "uuid"
import TooltipWrapper from "./TooltipWrapper"

interface StatProps {
  title: string
  children: ReactNode
  tooltipContent?: string
  className?: string
  description?: ReactNode
}

const Stat = ({ title, children, tooltipContent, className, description }: StatProps) => {
  const tooltipId = tooltipContent ? uuidv4() : undefined

  return (
    <div className={clsx("stat place-items-center", className)}>
      <div className="stat-title text-2xl text-inherit" data-tooltip-id={tooltipId}>
        {title}
      </div>
      {tooltipContent && (
        <TooltipWrapper id={tooltipId!} content={tooltipContent} className="z-[1099] ourtooltips" />
      )}
      <div>{children}</div>
      {description && <div className="stat-desc text-lg text-inherit">{description}</div>}
    </div>
  )
}

export default Stat

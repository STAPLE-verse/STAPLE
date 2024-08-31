import React from "react"
import { Tooltip } from "react-tooltip"
import PrimaryLink from "src/core/components/PrimaryLink"

interface WidgetProps {
  title: string
  display: React.ReactNode
  tooltipId: string
  tooltipContent: string
  link: React.ReactNode
}

const Widget: React.FC<WidgetProps> = ({ title, display, tooltipId, tooltipContent, link }) => {
  return (
    <div className="card-body">
      <div className="card-title text-base-content" data-tooltip-id={tooltipId}>
        {title}
      </div>
      {display}
      <Tooltip id={tooltipId} content={tooltipContent} className="z-[1099]" />
      <div className="card-actions justify-end">{link}</div>
    </div>
  )
}

export default Widget
